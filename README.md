# corrently-charge

<a href="https://stromdao.de/" target="_blank" title="STROMDAO - Digital Energy Infrastructure"><img src="./static/stromdao.png" align="right" height="85px" hspace="30px" vspace="30px"></a>

**Reference implementation of flexible charging tariffs for CPOs and EMTs based on Green Power Index and SolarEnergyPrediction APIs. Part of #mobilitython2022  - Enpulse challenge.**

Tariff builder for ChargePointOperators in the area of employee, tradefairs, hotels or areal parking.  

[![Join the chat at https://gitter.im/stromdao/corrently-charge](https://badges.gitter.im/stromdao/corrently-charge.svg)](https://gitter.im/stromdao/corrently-charge?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Challenge

Todays BEV charging lacks communication between driver/customer and charge point operator (CPO).

*If we would know the goals the driver has by time of connecting to our charging point, we could optimize our  energy dispatch for the charging session.*

### Goals
- integrate local generation (eq. photovoltaics) into tariffs
- reduce scope2 greenhouse gas emissions for customers
- ensure regulatory compliance   
- consult clients using data driving transparency
- expedite adoption of eMobility by providing  state of the art CX

### Problem definition
Flexibility of BEV charging for demand-side-management could not be used in public or semi-public charging-points. Local energy generation in conjunction with eMobility do not develop synergy effects making investments into energy management less attractive and limit customer experience in an upcomming competitive market.   

### Proposed solution
Automated tariff evaluation as soon as charging session starts. Tariffs take local generation and green power index into account giving different tariffs to the client as options of required energy (final state of charge), available time, energymix.

Selected tariff requirements are automatically fulfilled via a scheduler connection to CPO's backend (via OCPP protocol). The sollution corrently-charge acts as an intermediate between a given energy management system and the charge point.

Core of the solution is encapsulated into an Open-Source Node Module [NPM](https://www.npmjs.com/package/corrently-charge) allowing to quickly adopts new tariff models or limit number of available models based on requirements at a certain location.

[![Sample Plugin UX](./static/screenshot_result.jpg)](./static/screenshot_result.png)

### Business Model Canvas
[![Business Model Canvas](./challenge/bmc.pdf](./EnPulse_BusinessModelCanvas.png)

Or [browse online](./challenge/slides/BusinessCanvas_CorrentlyCharge.htm.html)

### [Working prototype](https://smith.corrently.cloud/app/mobilitython-corrently-charge/tariff-selection-631dc4f8caf77e03f003740b)
This prototype takes a real charging station located in the village Mauer (Germany) and uses the prediction of a PV power plant at the same grid connection point as local energy generation.

**Configured prices**
| Price per kWh | Source |
|---|---|
| 0.75€ | Mains / public grid |
| 0.30€ | PV / local generation |

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
