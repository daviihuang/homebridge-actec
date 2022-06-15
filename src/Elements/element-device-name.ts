import {DeviceContext, Element} from "./element";
import {PlatformAccessory, Service} from "homebridge";
import {ActecPlatform} from "../platform";

export class ElementDeviceName extends Element {
    constructor(context: DeviceContext) {
        super("element.device.name", context);

        this.addCharacteristic(this.platform?.Characteristic.ConfiguredName,
            async () => {
                this.log("")
            }, async value => {
                this.log("set :", value)
                if (this.platform && this.accessory && this.service) {
                    this.service.setCharacteristic(this.platform.Characteristic.Name, value);
                    this.platform.api.updatePlatformAccessories([this.accessory]);
                }
            })
    }

    public OnUpdate(value:object) {
        value = {}
    }
}
