export type Config = {
  SOLAR_PREDICTION: string;
  GSI_PREDICTION: string;
  localPrice: number;
  gridPrice: number;
};

export type BevCondition = {
  soc: number;
  maxpower: number;
  capacity: number;
  parkingTime?: number;
  parkingEnd?: number;
};

export type TarifDefinition = {
  name: string;
  maxpower: number;
  minduration: number;
  price: number;
  ghg: number;
  priceunit: Object;
  soctarget: number;
  localenergy: number;
};

/**
 * Get charge condition of a vehicle.
 */
export function getBevCondition(input: BevCondition): BevCondition {
  let { soc, maxpower, capacity, parkingTime } = input;

  if (isNaN(soc) || soc < 0 || soc > 100) {
    throw new Error("StateOfCharge (soc) must be between 0 and 100");
  }
  if (typeof parkingTime == "undefined" || parkingTime == null)
    parkingTime = 4 * 86400000; // Set to 4 days

  return {
    parkingTime: parkingTime,
    parkingEnd: new Date().getTime() + parkingTime,
    soc: soc, // State of Charge (0-100)
    maxpower: maxpower, // maximum charging power in Watt
    capacity: capacity, // capacity at 100% soc in Wh
  };
}
