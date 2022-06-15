<h1 align="center">Welcome to homebridge-actec 👋</h1>
<p>
  <a href="https://github.com/daviihuang/homebridge-actec" target="_blank">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D10.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/homebridge-%3E%3D0.2.0-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/cellcortex" target="_blank">
  </a>
</p>

Actec support for Homebridge: https://github.com/daviihuang/homebridge-actec with particular focus on supporting the special features of ceiling lights.

### 🏠 [Homepage](https://github.com/daviihuang/homebridge-actec)

## Prerequisites

- node >=16.6.0
- homebridge >=1.0.0

## Installation

You might want to update npm through: `$ sudo npm -g i npm@latest`

Install homebridge through: `$ sudo npm -g i homebridge`

Follow the instructions on GitHub to create a config.json in ~/.homebridge, as described;

Install the homebridge-hue plugin through: `$ sudo npm -g i homebridge-actec`

Edit `~/.homebridge/config.json` and add the actec platform provided by homebridge-actec, see Configuration;

## Configuration

In homebridge's config.json you need to specify homebridge-actec as a platform plugin. Furthermore, you need to specify what you want to expose to HomeKit. The simplest form is show below. This will enable the plugin and add all lights with their detected configuration to homekit.

```
"platforms": [
  {
  }
]
```

The plugin supports setting the configuration through [homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x).


```
"platforms": [
  {
    "platform": "actec",
    "name": "actec",
  }
]
```

## Author

👤 **davii**

- Email: [@davii](1019378663@qq.com)
- Github: [@davii](https://github.com/daviihuang/homebridge-actec)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](http://github.com/actec-iot/homebridge-actec/issues).

## Show your support

Give a ⭐️ if this project helped you!
