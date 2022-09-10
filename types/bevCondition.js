/**
* Type decleration of charge condition of a vehicle.
*/

module.exports = function(soc,maxpower,capacity) {
  if((isNaN(soc)) || (soc < 0 ) || ( soc > 100)) {
    throw new Error("StateOfCharge (soc) must be between 0 and 100");
  }
  this.soc = soc; // State of Charge (0-100)
  this.maxpower = maxpower; // maximum charging power in Watt
  this.capacity = capacity; // capacity at 100% soc in Wh
  return this;
}
