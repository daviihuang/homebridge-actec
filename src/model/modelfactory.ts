export const MODEL_SPECS: { [index: string]: object } = {
    "1002":{
        "name":"C3AB",
        "num":1,
        "brightness":true,
        "colortemp":true,
        "onoff":true,
        "color":true
    },
    "1003":{
        "name":"IEM-12/25/45B",
        "num":1,
        "brightness":true,
        "colortemp":true,
        "onoff":true,
        "color":false
    },
    "10":{
        "name":"TS6B-1G",
        "num":1,
        "brightness":false,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "11":{
        "name":"TS6B-2G",
        "num":2,
        "brightness":false,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "12":{
        "name":"TS6B-3G",
        "num":3,
        "brightness":false,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "14":{
        "name":"TDS6B-1G",
        "num":1,
        "brightness":true,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "15":{
        "name":"TDS6B-2G",
        "num":2,
        "brightness":true,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "16":{
        "name":"TDS6B-3G",
        "num":3,
        "brightness":true,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "30":{
        "name":"PS6B-1G",
        "num":1,
        "brightness":false,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "31":{
        "name":"PS6B-2G",
        "num":2,
        "brightness":false,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "32":{
        "name":"PS6B-3G",
        "num":3,
        "brightness":false,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "34":{
        "name":"PDS6B-1G",
        "num":1,
        "brightness":true,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "35":{
        "name":"PDS6B-2G",
        "num":2,
        "brightness":true,
        "colortemp":false,
        "onoff":true,
        "color":false
    },
    "36":{
        "name":"PDS6B-3G",
        "num":3,
        "brightness":true,
        "colortemp":false,
        "onoff":true,
        "color":false
    }
}
export class ModelFactory  {

     public static GetModel(pid:number) : object {
        console.log("pid:0x%08x, %s", pid, pid.toString(16))
        return MODEL_SPECS[pid.toString(16)]
    }

    public static GetDeviceName(pid:number) : [boolean, string] {
        const model = MODEL_SPECS[pid.toString(16)]
        if (!model) {
            return [false, ""]
        }
        return [true, model["name"]]
    }

    public static GetDeviceEndpoints(pid:number) :  number {
        const model = MODEL_SPECS[pid.toString(16)]
        if (!model) {
            return 0
        }
        return model["num"]
    }
}
