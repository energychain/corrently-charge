/**
* Decleration of a Tarif
*/

module.exports = function(name,maxpower,minduration,price,ghg,priceunit) {
  this.name = name;
  this.maxpower = maxpower;
  this.minduration = minduration;
  this.price = price;
  this.ghg = ghg;
  this.priceunit = priceunit;
  return this;
}
