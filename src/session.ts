import {Server, Agent, CoapRequestParams} from 'coap';
import CoAPServer from 'coap/dist/lib/server';
import {EventEmitter} from "node:stream";
import BufferListStream from 'bl'
const coap = require('coap')
import {timestamp} from "rxjs";
import {Protocal} from "./protocal";
import {Buffer as Buffer} from "node:buffer";

// const server = coap.createServer()
const sessionMap = new Map<string, Session>();

export declare function RequestCallback(error: number, data: object): void

export class Session extends EventEmitter {
    address: string;
    port: number;
    server: Server;

    private constructor(addr = "127.0.0.1") {
        super()
        this.address = addr
        this.port = 5683
        this.server = coap.createServer()
        this.server.listen(this.port, () => {
            console.log("server listen on %d", this.port)
        })
        this.server.on("request", (message, result) => {
            console.log("incoming data:", message)
            this.processIncomingData(message)
        })
    }

    public static instance(addr: string): Session {
        const session = sessionMap.get(addr)
        if (session) {
            return session
        }
        const newsession = new Session(addr)
        sessionMap.set(addr, newsession)
        return newsession
    }

    protected processIncomingData(buffer: BufferListStream) : boolean{
       return Protocal.ParseIncomingData(buffer)
    }

    public request(data: Buffer): boolean {
        const coapConnection: CoapRequestParams = {
            host: this.address,
            pathname: '/gw/service',
            method: 'POST',
            confirmable: true
        }
        // const url : string = 'coap://' + this.address + '/gw/service';
        coapConnection.token = Buffer.from("");
        const myreq = coap.request(coapConnection)
        coap.token = Buffer.from("");
        console.log("dest addr:", this.address)
        console.log("==>", data.toString(), "\n[",this.address, "]\n")
        myreq.on('response', (result) => {
            const buffer = new BufferListStream();
            result.pipe(buffer)
            result.on('end', () => {
                // console.log(buffer.toString())
                this.processIncomingData(buffer)
            })
        })
        myreq.end(data)
        return true
    }
}
