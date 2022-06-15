import {DeviceContext, Element} from "./element";
import {PlatformAccessory, Service} from "homebridge";
import {ActecPlatform} from "../platform";

export class ElementPercentage extends  Element {
    constructor(context:DeviceContext) {
        super("element.percentage", context);
    }

    public OnUpdate(value:object) {
        value = {}
    }
}
