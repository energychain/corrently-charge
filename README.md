# corrently-charge

<a href="https://stromdao.de/" target="_blank" title="STROMDAO - Digital Energy Infrastructure"><img src="./static/stromdao.png" align="right" height="85px" hspace="30px" vspace="30px"></a>

**Reference implementation of flexible charging tariffs for CPOs and EMTs based on Green Power Index and SolarEnergyPrediction APIs. Part of #mobilitython2022  - Enpulse challenge.**

## Installation
```
npm install --save corrently-charge
```

## Configuration
Either as  `.env` or during instanciation

|---|---|
| SOLAR_PREDICTION | URL to the solar prediction API to use |
| GSI_PREDICTION | URL to the Green Power Index API to use |



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
