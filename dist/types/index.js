"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBevCondition = void 0;
/**
 * Get charge condition of a vehicle.
 */
function getBevCondition(input) {
    let { soc, maxpower, capacity, parkingTime } = input;
    if (isNaN(soc) || soc < 0 || soc > 100) {
        throw new Error("StateOfCharge (soc) must be between 0 and 100");
    }
    if (typeof parkingTime == "undefined" || parkingTime == null)
        parkingTime = 4 * 86400000; // Set to 4 days
    return {
        parkingTime: parkingTime,
        parkingEnd: new Date().getTime() + parkingTime,
        soc: soc,
        maxpower: maxpower,
        capacity: capacity, // capacity at 100% soc in Wh
    };
}
exports.getBevCondition = getBevCondition;
//# sourceMappingURL=index.js.map