import { EventEmitter } from "node:events";
import dgram from "node:dgram";
import url from "node:url";
import httpHeaders from "http-headers";
import internal from "node:stream";
import { Interface } from "node:readline";
import {v4 as uuidv4} from 'uuid'; 
import {Protocal, Protocal as acp} from './protocal'
interface MyHeaders {
  [key: string]: string;
}

const options = {
  port: 9000,
  multicastAddr:"255.255.255.255",
};

export class Discovery extends EventEmitter {
  socket: dgram.Socket;
  constructor() {
    super();
    this.socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
    this.listen()
  }

  discover() {
    const buffer = Protocal.makeDiscover(1);
    console.log("===>", buffer[0].toString())
    this.socket.send(buffer[0], 0, buffer[0].length, options.port, options.multicastAddr);
  }

  listen() {
    this.socket.on("listening", () => {
      this.discover();
      this.emit("started");
    });

    this.socket.on("message", this.onMessage);
    this.socket.bind(options.port, () => {
      this.socket.setBroadcast(true);
    });
  }

  onMessage = (response: Buffer) => {
    console.log("<===", response.toString());
  };
}
