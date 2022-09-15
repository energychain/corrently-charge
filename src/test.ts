import * as dotenv from "dotenv";
import * as path from "path";

import { CC } from "./lib";
import { Config, BevCondition, getBevCondition } from "./types";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = async function () {
  const config: Config = {
    SOLAR_PREDICTION: process.env.SOLAR_PREDICTION,
    GSI_PREDICTION: process.env.GSI_PREDICTION,
    localPrice: parseFloat(process.env.localPrice),
    gridPrice: parseFloat(process.env.gridPrice),
  };

  // Define test data
  const bevConditionInput: BevCondition = {
    soc: 15,
    maxpower: 2200,
    capacity: 18000,
  };

  const instance = new CC(config);
  const chargingStart = getBevCondition(bevConditionInput);
  console.table(await instance.getTariffs(chargingStart));
};

app();
