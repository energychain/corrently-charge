module.exports = function(conf) {
    const axios = require("axios");

    /**
    * Returns a list of available tariffs for a given chargingStart condition.
    */

    this.getTariffs = async function(chargingStart) {
      const CO2PerKwh = 35;
      const localPrice = conf.localPrice * 1;
      const gridPrice = conf.gridPrice * 1;

      const pvPredictionAPI = await axios.get(conf.SOLAR_PREDICTION, {
        headers:{
          // Add Header if moved to Switchboard or Rapid-API
        }
      });
      const pvPrediction = pvPredictionAPI.data.output;
      const gsiPredictionAPI = await axios.get(conf.GSI_PREDICTION, {
        headers:{
          // Add Header if moved to Switchboard or Rapid-API
        }
      });
      const gsiPrediction = gsiPredictionAPI.data.forecast;
      if(typeof gsiPrediction == 'undefined') {
        throw new Error("Invalid GSI Data received:" + JSON.stringify(gsiPredictionAPI.data));
      }

      // Merge gsiPrediction into pvPrediction
      let j = 0;
      for(let i=0;i<pvPrediction.length;i++) {
        let searchHour = pvPrediction[i].timestamp;
        for(let k=j;(k<gsiPrediction.length) && (typeof pvPrediction[i].gsi == 'undefined');k++) {
          if(gsiPrediction[k].timeStamp == pvPrediction[i].timestamp) {
            pvPrediction[i].gsi = gsiPrediction[k];
            j=k;
          }
        }
      }

      const tariffs = [];
      const tarifDefintion = require("./types/tarifDefinition.js");
      const priceUnits = require("./types/priceUnits.js");

      // Initialize some helper variables
      let chargingSessionEnergy = chargingStart.capacity * ( 1 - (chargingStart.soc/100) );
      let chargingTime = (chargingSessionEnergy / chargingStart.maxpower) * 3600000;
      let ghg = 0;
      let startTime = new Date().getTime();

      // Fast Full Tariff
      for(let i=0;i<chargingTime/3600000;i++) {
        ghg +=  (chargingStart.maxpower/1000)*gsiPrediction[i].co2_g_oekostrom;
      }

      // tarifDefintion(name,maxpower,minduration,price,ghg,soctarget,priceunit)
      let chargingTimeGrid = chargingTime;

      tariffs.push(new tarifDefintion('Fast Full',chargingStart.maxpower,Math.round(chargingTime/60000),gridPrice,ghg,100,priceUnits.kwh));

      // Calculation for Local Green Full Tariff
      let i=0;
      chargingTime = 0;

      ghg = 0;
      chargingSessionEnergy = chargingStart.capacity * ( 1 - (chargingStart.soc/100) );


      while((i<pvPrediction.length) && (chargingSessionEnergy > 0)) {
        if((pvPrediction[i].timestamp > startTime-3600000) && (typeof pvPrediction[i].gsi !== 'undefined')) {
            let availableEnergy = pvPrediction[i].wh;
            if(availableEnergy > chargingStart.maxpower) availableEnergy = chargingStart.maxpower;
            chargingSessionEnergy -= availableEnergy;
            ghg -= (availableEnergy/1000) * pvPrediction[i].gsi.co2_g_oekostrom;
            chargingTime = pvPrediction[i].timestamp - startTime;
        }
        i++;
      }
      let chargingTimeLocal = chargingTime;
      tariffs.push(new tarifDefintion('Local Green Full',chargingStart.maxpower,Math.round(chargingTime/60000),localPrice,ghg,100,priceUnits.kwh));

      // Calculation for Eco Tariff
      i=0;
      chargingTime = 0;
      startTime = new Date().getTime();
      ghg = 0;
      let price = 0;

      let spotHours = [];
      let ecoEndTime = ((chargingTimeLocal - chargingTimeGrid)/2) + startTime;

      chargingSessionEnergy = chargingStart.capacity * ( 1 - (chargingStart.soc/100) );

      while((i<pvPrediction.length) && (chargingSessionEnergy > 0) && (pvPrediction[i].timestamp < ecoEndTime)) {
        if(pvPrediction[i].timestamp > startTime-3600000) {
            let availableEnergy = pvPrediction[i].wh;
            if(availableEnergy > chargingStart.maxpower) availableEnergy = chargingStart.maxpower;
            pvPrediction[i].used = availableEnergy;
            chargingSessionEnergy -= availableEnergy;
            price += (availableEnergy/1000) * localPrice;
            ghg -= (availableEnergy/1000)*CO2PerKwh;
            chargingTime = pvPrediction[i].timestamp - startTime;
            if((pvPrediction[i].used == 0) && (typeof pvPrediction[i].gsi !== 'undefined')) {
              spotHours.push(pvPrediction[i]);
            }
        }
        i++;
      }

      spotHours.sort((a,b) => a.gsi.co2_g_oekostrom - b.gsi.co2_g_oekostrom);
      i=0;
      while((i<spotHours.length) && (chargingSessionEnergy > 0)) {
        if(typeof  spotHours[i].gsi !== 'undefined') {
          pvPrediction[i].used = chargingStart.maxpower;
          chargingSessionEnergy -= chargingStart.maxpower;
          price += (chargingStart.maxpower/1000) * gridPrice;
          ghg += (chargingStart.maxpower/1000) * spotHours[i].gsi.co2_g_oekostrom;
        }
        i++;
      }
      if(chargingSessionEnergy < 0 ) {
        price -= Math.abs((chargingSessionEnergy/1000) * gridPrice)
      }
      tariffs.push(new tarifDefintion('Eco Full',chargingStart.maxpower,Math.round(chargingTime/60000),price,ghg,100,priceUnits.fix));

      // Calculation hours fixed Tariff
      const hrParkingTariffs = function(hrs,soctarget) {
            if((typeof soctarget == 'undefined') || (soctarget == null)) soctarget = 100;
            i=0;
            chargingTime = hrs * 3600000;
            startTime = new Date().getTime();
            ghg = 0;
            price = 0;

            spotHours = [];
            ecoEndTime = startTime + chargingTime;

            chargingSessionEnergy = (chargingStart.capacity * (soctarget/100))  * ( 1 - (chargingStart.soc/100) );

            while((i<pvPrediction.length) && (chargingSessionEnergy > 0) && (pvPrediction[i].timestamp < ecoEndTime)) {
              if((pvPrediction[i].timestamp > startTime-3600000) && (typeof pvPrediction[i].gsi !== 'undefined')) {
                  let availableEnergy = pvPrediction[i].wh;
                  if(availableEnergy > chargingStart.maxpower) availableEnergy = chargingStart.maxpower;
                  pvPrediction[i].used = availableEnergy;
                  chargingSessionEnergy -= availableEnergy;
                  price += (availableEnergy/1000) * localPrice;
                  ghg -= (availableEnergy/1000) * pvPrediction[i].gsi.co2_g_oekostrom;
                  if((pvPrediction[i].used == 0) && (typeof pvPrediction[i].gsi !== 'undefined')) {
                    spotHours.push(pvPrediction[i]);
                  }
              }
              i++;
            }

            spotHours.sort((a,b) => a.gsi.co2_g_oekostrom - b.gsi.co2_g_oekostrom);
            i=0;
            while((i<spotHours.length) && (chargingSessionEnergy > 0)) {
              if(typeof  spotHours[i].gsi !== 'undefined') {
                spotHours[i].used = chargingStart.maxpower;
                chargingSessionEnergy -= chargingStart.maxpower;
                price += (spotHours[i].used/1000) * gridPrice;
                ghg += (spotHours[i].used/1000) * spotHours[i].gsi.co2_g_oekostrom;
              }
              i++;
            }
            if(chargingSessionEnergy < 0 ) {
              price -= Math.abs((chargingSessionEnergy/1000) * gridPrice)
            }

            tariffs.push(new tarifDefintion(hrs+'h Fix SoC:'+soctarget+'%',chargingStart.maxpower,Math.round(chargingTime/60000),price,ghg,soctarget,priceUnits.fix));
      }
      chargingTimeLocal - chargingTimeGrid
      let minHours = Math.floor(chargingTimeGrid / 3600000) + 1;
      let maxHours = Math.floor(chargingTimeLocal / 3600000) - 1;

      for(let i=1;i<maxHours;i++) {
        for(let k=100;k>chargingStart.soc;k = k-20) {
          chargingSessionEnergy = (chargingStart.capacity * (k/100)) * ( 1 - (chargingStart.soc/100) );
          if( (chargingSessionEnergy / i) < chargingStart.maxpower  ) {
            hrParkingTariffs(i,k);
          }
        }
      }


      return tariffs;
    }
}
