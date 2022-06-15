import {Envir} from "../envir";
import {Service, PlatformAccessory, Characteristic, CharacteristicValue, Logger} from "homebridge";
import {ActecPlatform} from "../platform";
import {ElementDeviceName} from "./element-device-name";
import {ElementColortemp} from "./element-colortemp";
import {ElementHsv} from "./element-hsv";
import {ElementBrightess} from "./element-brightess";
import {ElementCommonOnoff} from "./element-common-onoff";

export interface DeviceContext {
    pid: number
    name:string
    service?:Service
    platform?:ActecPlatform
    accessory?:PlatformAccessory
    setAttribute?:  (key:string, value: object) => void
    getAttribute?: (key:string)  => Promise<object>
}

export const EMPTY_DEVICECONTEXT: DeviceContext = {
    pid : 0,
    name:"none",
}

export abstract class Element extends Envir{
    readonly service?:Service;
    readonly platform?: ActecPlatform;
    readonly accessory?:PlatformAccessory;
    protected  uuid = ""
    protected ctx:DeviceContext = {...EMPTY_DEVICECONTEXT}
    constructor(public prefix :string, public context: DeviceContext) {
        super(prefix, context?.platform?.log as Logger)
        this.service = context.service as Service
        this.platform = context.platform as ActecPlatform
        this.accessory = context.accessory as PlatformAccessory
        this.ctx = context
    }

    // public static instance(uuid:string, context:DeviceContext) : Element {
    //     let element
    //     switch (uuid) {
    //         case "colortemp":
    //             element = new ElementColortemp(context)
    //             break;
    //         case "color":
    //             element = new ElementHsv(context)
    //             break;
    //         case "brightness":
    //             element = new ElementBrightess(context)
    //             break;
    //         case "name":
    //             element = new ElementDeviceName(context)
    //             break;
    //         case "onoff":
    //         default:
    //             element = new ElementCommonOnoff(context)
    //             break;
    //     }
    //     return element
    // }

    //action from gateway
    public abstract OnUpdate(value:object);

    // private on
    protected async addCharacteristic(
        uuid: any,
        getter: () => Promise<any>,
        setter: (value: any) => void,
    ): Promise<Characteristic> {
        const characteristic = (this.service as Service).getCharacteristic(uuid);
        if (!characteristic) {
            return Promise.reject();
        }
        characteristic.on("get", async callback => {
            callback(undefined, await getter());
        });
        characteristic.on("set", async (value, callback) => {
            await setter(value);
            callback();
        });
        return characteristic;
    }
}
