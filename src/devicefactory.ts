import {Envir} from "./envir";
import {Logger} from "homebridge/lib/logger";

class DeviceFactory extends Envir {
    constructor(public readonly logger: Logger) {
        super("DeviceFactory", logger);
    }
}
