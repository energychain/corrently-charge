/**
* Decleration of a Tarif
*/

module.exports = function(name,maxpower,minduration,price,ghg,soctarget,priceunit,localenergy,reservedenergie) {
  this.name = name;
  this.maxpower = maxpower;
  this.minduration = minduration; // Minimum time required vehicle to be connected in Minutes
  this.price = Math.round(price*100)/100;
  this.ghg = Math.round(ghg);
  this.priceunit = priceunit;
  this.soctarget = soctarget;
  this.localenergy = localenergy;
  this.totalenergy = reservedenergie;
  return this;
}
