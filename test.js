const CC = require("./lib.js");
const BevCondition = require("./types/bevCondition.js");

const app = async function() {

  const instance = new CC();
  const chargingStart = new BevCondition(15,2000,18000);

  console.log(await instance.getTariffs(chargingStart));
}

app();
