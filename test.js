const CC = require("./lib.js");
const BevCondition = require("./types/bevCondition.js");

require('dotenv').config()

const app = async function() {
  const instance = new CC(process.env);
  const chargingStart = new BevCondition(15,2200,18000);
  console.table(await instance.getTariffs(chargingStart));
}

app();
