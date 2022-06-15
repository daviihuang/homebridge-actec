import {Envir} from "./envir"
import {AcDevice, DeviceInfo,DEVICE_INFO_INSTANCE} from "./device"
import {Logger} from "homebridge/lib/logger";
import {Protocal} from "./protocal";
import {PlatformAccessory, Service} from "homebridge";
import {ActecPlatform} from "./platform";
import {DeviceContext} from "./Elements/element";
import {PLATFORM_NAME, PLUGIN_NAME} from "./settings";
import {ModelFactory} from "./model/modelfactory";

export class DeviceAgent extends Envir {
    protected  deviceMap = new Map<string, AcDevice>()
    protected  accessories = new Map<string, PlatformAccessory>();
    constructor(public platform:ActecPlatform) {
        super("DeviceAgent", platform.log);
    }

    public PushAccessory(accessory : PlatformAccessory) {
        console.log(accessory.context.device.uuid, accessory.context.device)
        this.accessories.set(accessory.context.device.uuid, accessory);
    }

    public Start() {
        this.log("device agent service start!")
        this.on("report", this.onReport)
        this.updateDeviceList()
    }
    public Restart() {
        this.log("device agent will restart ...")
    }

    public Stop() {
        this.log ("device agent will stop ...")
    }

    protected parseProperty(propertyList: object, ep:number, pid:number) : number|string|object {
        for(const index in propertyList) {
            const property = propertyList[index]
            if (property["devEp"] == ep && property["pid"] == pid) {
                const value = property["value"]
                const key = "config_" + pid.toString();
                if (value[key]) {
                    // console.log("parseProperty key ==%s, value == %s\n", key , value[key])
                    return value[key]
                }
                return value
            }
        }
        return 0
    }

    protected retriveEndpointInfo(propertyList:object, ep:number) : object[] {
        const properties :object[] = []
        for(const index in propertyList) {
            const property = propertyList[index]
            if (property["devEp"] == ep) {
                properties.push(property)
            }
        }
        // device["properties"] = properties
        // device["devEp"] = ep
        return properties
    }

    protected getPid(propertyList:object) : number {
        return this.parseProperty(propertyList, 0, 13) as number
    }

    protected async updateDeviceList() {
        this.log("getUpdateDeviceList")
        const addedAccessories: PlatformAccessory[] = [];
        const updatedAccessories: PlatformAccessory[] = [];

        const data = await Protocal.DeviceListRequest()
        const status_list = await Protocal.DeviceStatusListRequest();
        console.log(data)
        // this.log(JSON.stringify(data))
        this.log(JSON.stringify(status_list))
        this.log("ok")
        const list = data["device_list"]
        for(const index in list) {
            const config = list[index]
            const device_id = config["device_id"]
            const propertyList = config["propertyList"]
            const pid = this.getPid(propertyList)
            const endpoint_count = ModelFactory.GetDeviceEndpoints(pid)
            const result = ModelFactory.GetDeviceName(pid)
            console.log("device_name:%s, device_id:%s, pid:0x%s, endpoint:%d", result[1], device_id, pid.toString(16), endpoint_count)

            if (endpoint_count == 0) {
                this.warn("skip unsupported device type!!!")
                continue
            }

            for (let cnt = 1; cnt <= endpoint_count; cnt++) {
                const devinfo : DeviceInfo = {...DEVICE_INFO_INSTANCE}
                const endpoints = this.retriveEndpointInfo(propertyList, cnt)
                const subdevice_id = device_id + "." + cnt.toString()
                devinfo["uuid"] = subdevice_id
                devinfo.devid = device_id
                devinfo.ep = cnt;
                let accessory = this.accessories.get(subdevice_id)
                if (accessory) {
                    accessory.context.device = devinfo
                    updatedAccessories.push(accessory)
                } else {
                    const uuid = this.platform.api.hap.uuid.generate(subdevice_id)
                    accessory = new this.platform.api.platformAccessory(subdevice_id, uuid)
                    accessory.context.device = devinfo
                    addedAccessories.push(accessory)
                }
                const device = AcDevice.instance({platform:this.platform,accessory:accessory, pid:pid, name:result[1]}, devinfo)
            }
        }
        this.platform.api.updatePlatformAccessories(updatedAccessories)
        this.platform.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, addedAccessories);
    }

    public onReport(data:object) {
        console.log("====onReport===>")
        this.log(data)
    }

}

