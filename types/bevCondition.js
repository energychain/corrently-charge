/**
* Type decleration of charge condition of a vehicle.
*/

module.exports = function(soc,maxpower,capacity,parkingtime) {
  if((isNaN(soc)) || (soc < 0 ) || ( soc > 100)) {
    throw new Error("StateOfCharge (soc) must be between 0 and 100");
  }
  if((typeof parkingtime == 'undefined')||(parkingtime == null)) parkingtime = 4 * 86400000; // Set to 4 days

  this.partkingtime = parkingtime;
  this.pargingEnd = new Date().getTime() + parkingtime;
  this.soc = soc; // State of Charge (0-100)
  this.maxpower = maxpower; // maximum charging power in Watt
  this.capacity = capacity; // capacity at 100% soc in Wh
  return this;
}
