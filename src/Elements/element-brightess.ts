import {DeviceContext, Element} from "./element";
import {PlatformAccessory, Service, uuid} from "homebridge";
import {ActecPlatform} from "../platform";
import {Protocal} from "../protocal";

export class ElementBrightess extends Element {
    constructor(context:DeviceContext) {
        super("light.brightess", context)
        this.uuid = "light.brightness"
        if (!context.platform) {
            return
        }

        this.addCharacteristic(context.platform.Characteristic.Brightness, async () => {
            this.log("get")
                // const attributes = await this.attributes();
                // return attributes.bright;
                return 100;
            },
            async value => {
                this.log("set", value)
                if (value > 0) {
                    const properties =[{"pid":32_774,"value":{"lightness":value}}]
                    if (this.context.setAttribute)
                        this.context.setAttribute("", properties)
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
