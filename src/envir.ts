import {EventEmitter} from "events";
import {Logger} from "homebridge/lib/logger";

export class Envir extends EventEmitter {
    constructor(public prefix:string, public readonly logger: Logger) {
        super();
    }

    private get Prefix(): string {
        return this.prefix;
    }

    private set Prefix(tag:string) {
        this.prefix = tag;
    }

    public log = (message?: unknown, ...optionalParameters: unknown[]): void => {
        this.logger.info(`${this.Prefix} ${message}`, optionalParameters);
    };

    public warn = (message?: unknown, ...optionalParameters: unknown[]): void => {
        this.logger.warn(`${this.Prefix} ${message}`, optionalParameters);
    };

    public error = (message?: unknown, ...optionalParameters: unknown[]): void => {
        this.logger.error(`${this.Prefix} ${message}`, optionalParameters);
    };

    public debug = (message?: unknown, ...optionalParameters: unknown[]): void => {
        // if (this.light.detailedLogging) {
        //     this.logger.info(`${this.Prefix} ${message}`, optionalParameters);
        // } else {
        this.logger.debug(`[${Date.parse(new Date().toString())} ${this.Prefix}] ${message}`, optionalParameters);
        // }
    }
};
