import {DeviceContext, Element} from "./element";
import {Logger} from "homebridge/lib/logger";
import {PlatformAccessory, Service} from "homebridge";
import {ActecPlatform} from "../platform";

export class ElementCommonOnoff extends Element{
    constructor(context:DeviceContext) {
        super("light.onoff", context)
        this.uuid = "light.onoff"
        if (!context.platform) {
            return
        }

        this.addCharacteristic(context.platform.Characteristic.On, async () => {
                this.log("get")
                // const attributes = await this.attributes();
                // return attributes.bright;
            },
            async value => {
                this.log("set", value)
                const properties =[{"pid":32_769,"value":{"onOff":(value ? 1:0)}}]
                    if (this.context.setAttribute)
                         this.context.setAttribute("", properties)
                    // await this.ensurePowerMode(0);
                    // await this.sendSuddenCommand("set_bright", value);
                    // this.setAttributes({ power: true, bright: value });
                    // this.saveDefaultIfNeeded();
            })
    }
    public OnUpdate(value:object) {
        value = {}
    }
}
