/**
* Decleration of a Tarif
*/

module.exports = function(name,maxpower,minduration,price,ghg,soctarget,priceunit) {
  this.name = name;
  this.maxpower = maxpower;
  this.minduration = minduration; // Minimum time required vehicle to be connected in Minutes
  this.price = price; 
  this.ghg = ghg;
  this.priceunit = priceunit;
  this.soctarget = soctarget;
  return this;
}
