import {v4 as uuidv4} from 'uuid';
import {RequestCallback, Session} from './session'
import BufferListStream from "bl";
import {Envir} from "./envir";
import {EventEmitter} from "node:events";
import {Buffer as Buffer} from "node:buffer";
import {timeout} from "rxjs";

export interface Payload{
    seq:string;
    action: string;
    data: object;
} 
export interface AcProto {
    from: string;
    to:string;
    encrypt:string;
    payload:Payload;
}

// {"payload":{"data":
// {"udid":"c08c9b68ec597e77c81d6e02aaf06104","mac":"66367A09DAB4","product_key":"1","network_type":"eth","ip":"192.168.1.33","port":"5683","status":0},
// "action":"/gw/discover","result":200,"seq":"1af0b52b-0b83-40f1-8f2e-7166f936d435"},"from":"c08c9b68ec597e77c81d6e02aaf06104","to":"homekit","encrypt":"none"}

export interface AcDiscoverRsp {
    port:string
    udid:string
    mac:string
    product_key:string
    network_type:string
    ip:string
    status:number
}

export interface ProtoParameter {
    retcode: number
    seq:string
    payload:object
    from:string
    to:string
}
// export interface 
const EMPTY_DISCOVERINFO: AcProto = {
    from:"homekit",
    to:"gateway",
    encrypt:"none",
    payload:{
        seq:"",
        action:"/gw/discover",
        data:{
          udid: "",
          status:1
        }
    }
  };

  const EMPTY_REQUESTINFO: AcProto = {
    from:"18859288651",
    to:"gateway",
    encrypt:"none",
    payload:{
        seq:"",
        action:"/gw/discover",
        data:{udid:""}
    }
  };

export interface Deferred {
    updateResolve?: (data: object) => void;
    updateReject?: () => void;
    callback?: typeof RequestCallback;
    callback_timeout ?: typeof RequestCallback;
    timeout?: number;
    timestamp?: number;
    dirty?: boolean;
    response?:object;
}

const HasInited = false
export class Protocal {
    protected static transactions = new Map<string, Deferred>();
    protected static sessionMap = new Map<string, Session>();

    public static Brigde(session:Session) {
        // setTimeout(this.listener, 1000)
        if (this.sessionMap.has(session.address)) {
            return
        }
        this.sessionMap.set(session.address, session)
    }

    protected static listener = () =>{
        for (const [key, item] of this.transactions.entries()) {
            if (!item.timeout)
                item.timeout = 10_000
            if (item.timeout + (item.timestamp as number) > Date.now()) {
                if (item.callback_timeout)
                    item.callback_timeout(0, new Error("timeout"))
                if (item.updateReject)
                    item.updateReject()
                this.transactions.delete(key)
            }
        }
        setTimeout(this.listener, 1000)
    }

    public static makeDiscover (stat:number) : [Buffer, string] {
       const  requestData : AcProto = {...EMPTY_DISCOVERINFO};
       requestData.payload.seq = uuidv4();
       requestData.payload.data = {status:stat};
       const buffer = Buffer.from(JSON.stringify(requestData));
       return [buffer, requestData.payload.seq];
    }

    public static onDiscover (data: Buffer) {
        const myobj : object = JSON.parse(data.toString());
        console.log(myobj)
        const gw:AcDiscoverRsp = myobj['payload']['data']
        console.log(gw.mac);
        console.log(gw.product_key)
        console.log(gw.ip);
        const session = Session.instance("")
        console.log("will get device list")
    }

    protected static async transfer(action:string , data:object) : Promise<object> {
        const requestData : AcProto = {...EMPTY_REQUESTINFO}
        requestData.payload.seq = uuidv4()
        requestData.payload.action = action
        requestData.payload.data = data
        const buffer = Buffer.from(JSON.stringify(requestData))
        console.log("transfer 1")
        return new Promise<object>((resolve, reject) => {
            const defer = {timeout:0, updateResolve:resolve, updateReject:reject }
            console.log("transfer 2")
            this.transactions.set(requestData.payload.seq, defer)
            for (const [key, session] of this.sessionMap.entries()) {
                console.log("transfer 3")
                session.request(buffer)
            }
        })
    }

    public static async DeviceListRequest() : Promise<object> {
        const data = {}
        data["value"] = {}
        data["type"] = 0
        return await this.transfer("/dev/list", data)
    }

    public static async DeviceStatusListRequest() : Promise<object> {
        const data = {}
        data["value"] = {}
        data["type"] = 2
        return await this.transfer("/dev/list", data)
    }

// {"encrypt":"none","payload":{"seq":"E6AFE2C2-7596-4DBA-AAC6-5E2DFEF243F9","action":"\/dev\/get","data":{"type":0,"device_id":"00000000","devEps":[0,1,4]}},"to":"gateway","from":"18859288651"}
    public static async GetGatewayInfo() : Promise<object> {
        const data = {"type":0,"device_id":"00000000","devEps":[0,1,4]}
        return await this.transfer("/dev/get", data)
    }

    public static async SetAttribute(id : string, ep:number, properties:object) : Promise<object> {
        const data = {}
        data["devEp"] = ep
        data["device_id"] = id
        data["propertyList"] = properties
        return await this.transfer("/dev/set", data)
    }

    public static async GetAttribute(id:string, eps:object, type = 0) : Promise<object> {
        const data = {}
        data["type"] = type
        data["device_id"] = id
        data["devEps"] = eps
        return await this.transfer("/dev/get", data)
    }

    public static HandleReportData(data:object) : boolean {
        const myemit = new EventEmitter()
        myemit.emit("report", data["eventList"])
        return true
    }

    public static ParseIncomingData(data:BufferListStream) : boolean {
        const json = JSON.parse(data.toString())
        console.log(json.payload)
        if (!json.payload["result"]) {
            console.log("ParseIncomingData1");
            return this.HandleReportData(json.payload.data)
        }

        const trans = this.transactions.get(json.payload.seq)
        if (trans && json.payload && trans.updateResolve) {
            console.log("ParseIncomingData2");
            trans.updateResolve(json.payload.data)
            // trans.callback(0, json.payload.data)
            delete trans.updateResolve
            delete trans.updateReject
            this.transactions.delete(json.payload.seq)
        }
        return true
    }

    public static ParseResponseData(data:BufferListStream) : [boolean, object, string] {
        const json = JSON.parse(data.toString())
        return [true, json, json?.udid]
    }

}
