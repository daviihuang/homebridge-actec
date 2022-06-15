import {EventEmitter} from "node:events";
import {DeviceContext, Element, EMPTY_DEVICECONTEXT} from "./Elements/element";
import {Protocal} from "./protocal";
import {ModelFactory} from "./model/modelfactory";
import {ElementColortemp} from "./Elements/element-colortemp";
import {ElementHsv} from "./Elements/element-hsv";
import {ElementBrightess} from "./Elements/element-brightess";
import {ElementDeviceName} from "./Elements/element-device-name";
import {ElementCommonOnoff} from "./Elements/element-common-onoff";

export interface Attribute {
    key:string
    value:number|boolean|string|object
}

export interface DeviceInfo {
    pid:number
    devid:string
    ep:number
    nick:string
    name:string
    sn:string
    model:string
    manufactory:string
    firmware:string
    attributes?:Map<string, Attribute>
}

export const DEVICE_INFO_INSTANCE : DeviceInfo = {
    pid: 0,
    devid:"",
    ep:0,
    name:"none",
    nick:"none",
    sn:"none",
    model:"none",
    manufactory:"Actec",
    firmware:"1.0.0"
}

export class AcDevice extends EventEmitter {
    // context : DeviceContext = {...EMPTY_DEVICECONTEXT}
    // protected attributes: object;

    protected online = true
    protected elements = new Map<string, Element>();

    public static instance(context:DeviceContext, info:DeviceInfo) {
        const device_id = context.pid
        console.log(JSON.stringify(info))
        // const propertyList = config["propertyList"]
        // const pid = this.getPid(propertyList)
        console.log("add device: device_id:%d pid:0x%s", device_id, context.pid)
        return new AcDevice(context, info);
    }

    protected  constructor(public context: DeviceContext, public info:DeviceInfo) {
        super()
        if (!this.context.accessory || !this.context.platform) {
            console.log("Device constructor parameter null!!!")
            return
        }
        this.context.getAttribute = this.getAttribute.bind(this)
        this.context.setAttribute = this.setAttribute.bind(this)
        this.online = true
        this.context.service = this.context.accessory.getService(this.context.platform.Service.Lightbulb)
            || this.context.accessory.addService(this.context.platform.Service.Lightbulb);

        const model = ModelFactory.GetModel(this.context.pid)
        for (const key in model) {
            if (key == "name" || key == "num")
                continue
            if (model[key] == false)
                continue
            console.log("key:%s, value:%s", key, model[key]);
            this.PushElement(key)
        }

        this.on("update", this.onUpdate)
        this.on("connect", this.onConnected)
        this.on("disconnect", this.onDisconnect)
        this.setInfoService()
    }

    onUpdate = (data: object) => {
        this.online = true
        for (const [key, item] of this.elements.entries()) {
            item.OnUpdate(data)
        }
    }

    onConnected = (data: object) => {
        this.online = true
    }

    onDisconnect = (data: object) => {
        this.online = false
    }

    public  getAttribute(key:string) : Promise<object> {
        const value = Protocal.GetAttribute(this.info.devid, [this.info.ep])
        return value
    }

    public setAttribute(key:string, value:object) : boolean {
        console.log("####device_id:%s, ep:%d", this.info.devid, this.info.ep)
        Protocal.SetAttribute(this.info.devid, this.info.ep, value)
        return true
    }

    protected  setInfoService() {
        if (!this.context.accessory || !this.context.platform)
            return
        // set accessory information
        let infoService = this.context.accessory.getService(this.context.platform.Service.AccessoryInformation);
        if (!infoService) {
            infoService = new this.context.platform.Service.AccessoryInformation();
            infoService
                .updateCharacteristic(this.context.platform.Characteristic.Manufacturer, this.info.manufactory)
                .updateCharacteristic(this.context.platform.Characteristic.Model, this.info.model)
                .updateCharacteristic(this.context.platform.Characteristic.Name, this.info.name)
                .updateCharacteristic(this.context.platform.Characteristic.SerialNumber, this.info.sn)
                .updateCharacteristic(this.context.platform.Characteristic.FirmwareRevision, this.info.firmware)
            this.context.accessory.addService(infoService);
        } else {
            // re-use service from cache
            infoService
                .updateCharacteristic(this.context.platform.Characteristic.Manufacturer, this.info.manufactory)
                .updateCharacteristic(this.context.platform.Characteristic.Model, this.info.model)
                .updateCharacteristic(this.context.platform.Characteristic.Name, this.info.name)
                .updateCharacteristic(this.context.platform.Characteristic.SerialNumber, this.info.sn)
                .updateCharacteristic(this.context.platform.Characteristic.FirmwareRevision, this.info.firmware)
        }
        // this.setNameService(infoService);

        return infoService;
    }


    public PushElement(uuid: string) : Element {
        const cached = this.elements.get(uuid)
        if (cached) {
            return cached;
        }
        let element
        switch (uuid) {
            case "colortemp":
                element = new ElementColortemp(this.context)
                break;
            case "color":
                element = new ElementHsv(this.context)
                break;
            case "brightness":
                element = new ElementBrightess(this.context)
                break;
            case "name":
                element = new ElementDeviceName(this.context)
                break;
            case "onoff":
            default:
                element = new ElementCommonOnoff(this.context)
                break;
        }
        this.elements.set(uuid, element)
        return element
    }

    protected PopElement(uuid: string) {
        this.elements.delete(uuid)
    }
}
