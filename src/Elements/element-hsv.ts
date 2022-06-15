import {DeviceContext, Element} from "./element";
import {PlatformAccessory, Service} from "homebridge";
import {ActecPlatform} from "../platform";

export class ElementHsv extends  Element {

    constructor(context:DeviceContext) {
        super("light.hsv", context)
        this.uuid = "light.hsv"
        if (!context.platform) {
            return
        }


        this.addCharacteristic(context.platform.Characteristic.Brightness, async () => {
                this.log("get")
                // const attributes = await this.attributes();
                // return attributes.bright;
            },
            async value => {
                this.log("set", value)
                if (value > 0) {
                    // await this.ensurePowerMode(0);
                    // await this.sendSuddenCommand("set_bright", value);
                    // this.setAttributes({ power: true, bright: value });
                    // this.saveDefaultIfNeeded();
                } else {
                    // await this.sendSuddenCommand("set_power", "off");
                    // this.setAttributes({ power: false, bright: 0 });
                }
            })

        this.addCharacteristic(context.platform.Characteristic.Hue, async () => {
                this.log("get")
                // const attributes = await this.attributes();
                // return attributes.bright;
            },
            async value => {
                this.log("set", value)
                if (value > 0) {
                    // await this.ensurePowerMode(0);
                    // await this.sendSuddenCommand("set_bright", value);
                    // this.setAttributes({ power: true, bright: value });
                    // this.saveDefaultIfNeeded();
                } else {
                    // await this.sendSuddenCommand("set_power", "off");
                    // this.setAttributes({ power: false, bright: 0 });
                }
            })

        this.addCharacteristic(context.platform.Characteristic.Saturation, async () => {
                this.log("get")
                // const attributes = await this.attributes();
                // return attributes.bright;
            },
            async value => {
                this.log("set", value)
                if (value > 0) {
                    // await this.ensurePowerMode(0);
                    // await this.sendSuddenCommand("set_bright", value);
                    // this.setAttributes({ power: true, bright: value });
                    // this.saveDefaultIfNeeded();
                } else {
                    // await this.sendSuddenCommand("set_power", "off");
                    // this.setAttributes({ power: false, bright: 0 });
                }
            })
    }


    public OnUpdate(value:object) {
        value = {}
    }
}
