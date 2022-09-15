"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const lib_1 = require("./lib");
const types_1 = require("./types");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const app = async function () {
    const config = {
        SOLAR_PREDICTION: process.env.SOLAR_PREDICTION,
        GSI_PREDICTION: process.env.GSI_PREDICTION,
        localPrice: parseFloat(process.env.localPrice),
        gridPrice: parseFloat(process.env.gridPrice),
    };
    // Define test data
    const bevConditionInput = {
        soc: 15,
        maxpower: 2200,
        capacity: 18000,
    };
    const instance = new lib_1.CC(config);
    const chargingStart = (0, types_1.getBevCondition)(bevConditionInput);
    console.table(await instance.getTariffs(chargingStart));
};
app();
//# sourceMappingURL=test.js.map