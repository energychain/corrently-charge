"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CC = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
class CC {
    constructor(config) {
        /**
         * Returns a list of available tariffs for a given bevCondition condition.
         */
        this.getTariffs = async (bevCondition) => {
            const conf = this.config;
            const CO2PerKwh = 35;
            const localPrice = conf.localPrice * 1;
            const gridPrice = conf.gridPrice * 1;
            const pvPredictionAPI = await axios_1.default.get(conf.SOLAR_PREDICTION, {
                headers: {
                // Add Header if moved to Switchboard or Rapid-API
                },
            });
            const pvPrediction = pvPredictionAPI.data.output;
            const gsiPredictionAPI = await axios_1.default.get(conf.GSI_PREDICTION, {
                headers: {
                // Add Header if moved to Switchboard or Rapid-API
                },
            });
            const gsiPrediction = gsiPredictionAPI.data.forecast;
            if (typeof gsiPrediction == "undefined") {
                throw new Error("Invalid GSI Data received:" + JSON.stringify(gsiPredictionAPI.data));
            }
            // Merge gsiPrediction into pvPrediction
            let j = 0;
            for (let i = 0; i < pvPrediction.length; i++) {
                let searchHour = pvPrediction[i].timestamp;
                for (let k = j; k < gsiPrediction.length && typeof pvPrediction[i].gsi == "undefined"; k++) {
                    if (gsiPrediction[k].timeStamp == pvPrediction[i].timestamp) {
                        pvPrediction[i].gsi = gsiPrediction[k];
                        j = k;
                    }
                }
            }
            const tariffs = [];
            // Initialize some helper variables
            let chargingSessionEnergy = bevCondition.capacity * (1 - bevCondition.soc / 100);
            let chargingTime = (chargingSessionEnergy / bevCondition.maxpower) * 3600000;
            let ghg = 0;
            let localEnergy = 0;
            let startTime = new Date().getTime();
            // Fast Full Tariff
            for (let i = 0; i < chargingTime / 3600000; i++) {
                ghg += (bevCondition.maxpower / 1000) * gsiPrediction[i].co2_g_oekostrom;
            }
            // tarifDefintion(name,maxpower,minduration,price,ghg,soctarget,priceunit)
            let chargingTimeGrid = chargingTime;
            let tarifDefinition;
            tarifDefinition = {
                name: "Fast Full",
                maxpower: bevCondition.maxpower,
                minduration: Math.round(chargingTime / 60000),
                price: Math.round(gridPrice * 100) / 100,
                ghg: Math.round(ghg),
                soctarget: 100,
                priceunit: constants_1.priceUnits.kwh,
                localenergy: localEnergy,
            };
            tariffs.push(tarifDefinition);
            // Calculation for Local Green Full Tariff
            let i = 0;
            chargingTime = 0;
            ghg = 0;
            localEnergy = 0;
            chargingSessionEnergy =
                bevCondition.capacity * (1 - bevCondition.soc / 100);
            while (i < pvPrediction.length && chargingSessionEnergy > 0) {
                if (pvPrediction[i].timestamp > startTime - 3600000 &&
                    typeof pvPrediction[i].gsi !== "undefined") {
                    let availableEnergy = pvPrediction[i].wh;
                    if (availableEnergy > bevCondition.maxpower)
                        availableEnergy = bevCondition.maxpower;
                    chargingSessionEnergy -= availableEnergy;
                    localEnergy += availableEnergy;
                    ghg -= (availableEnergy / 1000) * pvPrediction[i].gsi.co2_g_oekostrom;
                    chargingTime = pvPrediction[i].timestamp - startTime;
                }
                i++;
            }
            let chargingTimeLocal = chargingTime;
            tarifDefinition = {
                name: "Local Green Full",
                maxpower: bevCondition.maxpower,
                minduration: Math.round(chargingTime / 60000),
                price: Math.round(localPrice * 100) / 100,
                ghg: Math.round(ghg),
                soctarget: 100,
                priceunit: constants_1.priceUnits.kwh,
                localenergy: localEnergy,
            };
            tariffs.push(tarifDefinition);
            // Calculation for Eco Tariff
            i = 0;
            chargingTime = 0;
            startTime = new Date().getTime();
            ghg = 0;
            let price = 0;
            localEnergy = 0;
            let spotHours = [];
            let ecoEndTime = (chargingTimeLocal - chargingTimeGrid) / 2 + startTime;
            chargingSessionEnergy =
                bevCondition.capacity * (1 - bevCondition.soc / 100);
            while (i < pvPrediction.length &&
                chargingSessionEnergy > 0 &&
                pvPrediction[i].timestamp < ecoEndTime) {
                if (pvPrediction[i].timestamp > startTime - 3600000) {
                    let availableEnergy = pvPrediction[i].wh;
                    if (availableEnergy > bevCondition.maxpower)
                        availableEnergy = bevCondition.maxpower;
                    pvPrediction[i].used = availableEnergy;
                    chargingSessionEnergy -= availableEnergy;
                    localEnergy += availableEnergy;
                    price += (availableEnergy / 1000) * localPrice;
                    ghg -= (availableEnergy / 1000) * CO2PerKwh;
                    chargingTime = pvPrediction[i].timestamp - startTime;
                    if (pvPrediction[i].used == 0 &&
                        typeof pvPrediction[i].gsi !== "undefined") {
                        spotHours.push(pvPrediction[i]);
                    }
                }
                i++;
            }
            spotHours.sort((a, b) => a.gsi.co2_g_oekostrom - b.gsi.co2_g_oekostrom);
            i = 0;
            while (i < spotHours.length && chargingSessionEnergy > 0) {
                if (typeof spotHours[i].gsi !== "undefined") {
                    pvPrediction[i].used = bevCondition.maxpower;
                    chargingSessionEnergy -= bevCondition.maxpower;
                    price += (bevCondition.maxpower / 1000) * gridPrice;
                    ghg +=
                        (bevCondition.maxpower / 1000) * spotHours[i].gsi.co2_g_oekostrom;
                }
                i++;
            }
            if (chargingSessionEnergy < 0) {
                price -= Math.abs((chargingSessionEnergy / 1000) * gridPrice);
            }
            tarifDefinition = {
                name: "Eco Full",
                maxpower: bevCondition.maxpower,
                minduration: Math.round(chargingTime / 60000),
                price: Math.round(price * 100) / 100,
                ghg: Math.round(ghg),
                soctarget: 100,
                priceunit: constants_1.priceUnits.fix,
                localenergy: localEnergy,
            };
            tariffs.push(tarifDefinition);
            // Calculation hours fixed Tariff
            const hrParkingTariffs = function (hrs, soctarget) {
                if (typeof soctarget == "undefined" || soctarget == null)
                    soctarget = 100;
                i = 0;
                chargingTime = hrs * 3600000;
                startTime = new Date().getTime();
                ghg = 0;
                price = 0;
                localEnergy = 0;
                spotHours = [];
                ecoEndTime = startTime + chargingTime;
                chargingSessionEnergy =
                    bevCondition.capacity *
                        (soctarget / 100) *
                        (1 - bevCondition.soc / 100);
                while (i < pvPrediction.length &&
                    chargingSessionEnergy > 0 &&
                    pvPrediction[i].timestamp < ecoEndTime) {
                    if (pvPrediction[i].timestamp > startTime - 3600000 &&
                        typeof pvPrediction[i].gsi !== "undefined") {
                        let availableEnergy = pvPrediction[i].wh;
                        if (availableEnergy > bevCondition.maxpower)
                            availableEnergy = bevCondition.maxpower;
                        pvPrediction[i].used = availableEnergy;
                        chargingSessionEnergy -= availableEnergy;
                        localEnergy += availableEnergy;
                        price += (availableEnergy / 1000) * localPrice;
                        ghg -= (availableEnergy / 1000) * pvPrediction[i].gsi.co2_g_oekostrom;
                        if (pvPrediction[i].used == 0 &&
                            typeof pvPrediction[i].gsi !== "undefined") {
                            spotHours.push(pvPrediction[i]);
                        }
                    }
                    i++;
                }
                spotHours.sort((a, b) => a.gsi.co2_g_oekostrom - b.gsi.co2_g_oekostrom);
                i = 0;
                while (i < spotHours.length && chargingSessionEnergy > 0) {
                    if (typeof spotHours[i].gsi !== "undefined") {
                        spotHours[i].used = bevCondition.maxpower;
                        chargingSessionEnergy -= bevCondition.maxpower;
                        price += (spotHours[i].used / 1000) * gridPrice;
                        ghg += (spotHours[i].used / 1000) * spotHours[i].gsi.co2_g_oekostrom;
                    }
                    i++;
                }
                if (chargingSessionEnergy < 0) {
                    price -= Math.abs((chargingSessionEnergy / 1000) * gridPrice);
                }
                tarifDefinition = {
                    name: hrs + "h Fix SoC:" + soctarget + "%",
                    maxpower: bevCondition.maxpower,
                    minduration: Math.round(chargingTime / 60000),
                    price: Math.round(price * 100) / 100,
                    ghg: Math.round(ghg),
                    soctarget: soctarget,
                    priceunit: constants_1.priceUnits.fix,
                    localenergy: localEnergy,
                };
                tariffs.push(tarifDefinition);
            };
            chargingTimeLocal - chargingTimeGrid;
            let minHours = Math.floor(chargingTimeGrid / 3600000) + 1;
            let maxHours = Math.floor(chargingTimeLocal / 3600000) - 1;
            for (let i = 1; i < maxHours; i++) {
                for (let k = 100; k > bevCondition.soc; k = k - 20) {
                    chargingSessionEnergy =
                        bevCondition.capacity * (k / 100) * (1 - bevCondition.soc / 100);
                    if (chargingSessionEnergy / i < bevCondition.maxpower) {
                        hrParkingTariffs(i, k);
                    }
                }
            }
            tarifDefinition = {
                name: "20.000 km/yr (50%, 6h)",
                maxpower: bevCondition.maxpower,
                minduration: 6 * 60,
                price: Math.round(9.9 * 100) / 100,
                ghg: Math.round(0),
                priceunit: constants_1.priceUnits.subscription,
                soctarget: 50,
                localenergy: localEnergy,
            };
            tariffs.push(tarifDefinition);
            tarifDefinition = {
                name: "20.000 km/yr (80%, 6h)",
                maxpower: bevCondition.maxpower,
                minduration: 6 * 60,
                price: Math.round(14.9 * 100) / 100,
                ghg: Math.round(0),
                priceunit: constants_1.priceUnits.subscription,
                soctarget: 80,
                localenergy: localEnergy,
            };
            tariffs.push(tarifDefinition);
            tarifDefinition = {
                name: "20.000 km/yr (50%, 12h)",
                maxpower: bevCondition.maxpower,
                minduration: 12 * 60,
                price: Math.round(6.9 * 100) / 100,
                ghg: Math.round(0),
                priceunit: constants_1.priceUnits.subscription,
                soctarget: 50,
                localenergy: localEnergy,
            };
            tariffs.push(tarifDefinition);
            return tariffs;
        };
        this.config = config;
    }
}
exports.CC = CC;
//# sourceMappingURL=lib.js.map