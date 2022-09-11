# corrently-charge

<a href="https://stromdao.de/" target="_blank" title="STROMDAO - Digital Energy Infrastructure"><img src="./static/stromdao.png" align="right" height="85px" hspace="30px" vspace="30px"></a>

**Reference implementation of flexible charging tariffs for CPOs and EMTs based on Green Power Index and SolarEnergyPrediction APIs. Part of #mobilitython2022  - Enpulse challenge.**

[Demo MVP](https://smith.corrently.cloud/app/mobilitython-corrently-charge/tariff-selection-631dc4f8caf77e03f003740b)

## Challenge
Todays BEV charging lacks communication between driver/customer and charge point operator (CPO).

*If we would know the goals the driver has by time of connecting to our charging point, we could optimize our  energy dispatch for the charging session.*

### Goals
- integrate local generation (eq. photovoltaics) into tariffs
- reduce scope2 greenhouse gas emissions for customers
- ensure regulatory compliance   
- consult clients using data driving transparency
- expedite adoption of eMobility by providing  state of the art CX

## Installation
```
npm install --save corrently-charge
```

## Configuration
Either as  `.env` or during instanciation

| Setting | Description |
|---|---|
| `SOLAR_PREDICTION` | URL to the solar prediction API to use |
| `GSI_PREDICTION` | URL to the Green Power Index API to use |
| `localPrice`  | Price per kwh for local energy (eq. solar) |
| `gridPrice`   | Price per kwh for energy from grid |



## Limitations
- Does not respect none-linear maxpower
- Does not respect reactive power in low power charging conditions

## [CONTRIBUTING](https://github.com/energychain/corrently-charge/blob/main/CONTRIBUTING.md)

## [CODE OF CONDUCT](https://github.com/energychain/corrently-charge/blob/main/CODE_OF_CONDUCT.md)


## Maintainer / Imprint

<addr>
STROMDAO GmbH  <br/>
Gerhard Weiser Ring 29  <br/>
69256 Mauer  <br/>
Germany  <br/>
  <br/>
+49 6226 968 009 0  <br/>
  <br/>
kontakt@stromdao.com  <br/>
  <br/>
Handelsregister: HRB 728691 (Amtsgericht Mannheim)
</addr>


## LICENSE
[MIT](./LICENSE)
