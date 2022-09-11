const CC = require("./lib.js");
const BevCondition = require("./types/bevCondition.js");

require('dotenv').config()

const app = async function() {
  const instance = new CC(process.env);
  const chargingStart = new BevCondition(15,2000,18000);
  console.log(await instance.getTariffs(chargingStart));
}

app();
