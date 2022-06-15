import {
    API,
    DynamicPlatformPlugin,
    Logger as Logger,
    PlatformAccessory,
    PlatformConfig,
    Service,
    Characteristic
} from "homebridge";

import {Session} from "./session";
import {Protocal as protocal} from "./protocal"
import {DeviceAgent} from "./deviceagent";
import {Discovery} from "./discovery";

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class ActecPlatform implements DynamicPlatformPlugin {
    public readonly Service: typeof Service = this.api.hap.Service;
    public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

    // this is used to track restored cached accessories
    public readonly accessories: PlatformAccessory[] = [];
    public readonly agent: DeviceAgent


    constructor(
        public readonly log: Logger,
        public readonly config: PlatformConfig,
        public readonly api: API,
    ) {
        this.log.debug("Finished initializing platform:", this.config.name);
        // // logger.setDebugEnabled(true)
        const discover = new Discovery()
        discover.discover()
        protocal.Brigde(Session.instance("192.168.1.200"))
        this.agent = new DeviceAgent(this)

        // When this event is fired it means Homebridge has restored all cached accessories from disk.
        // Dynamic Platform plugins should only register new accessories after this event was fired,
        // in order to ensure they weren't added to homebridge already. This event can also be used
        // to start discovery of new accessories.
        this.api.on("didFinishLaunching", () => {
            this.log.debug("Executed didFinishLaunching callback");
            this.agent.Start()
        });
    }

    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory: PlatformAccessory) {
        if (this.accessories.some(a => a.UUID === accessory.UUID)) {
            this.log.warn(`Ingnoring duplicate accessory from cache: ${accessory.displayName} (${accessory.context?.device?.model || "unknown"})`);
            return;
        }
        this.log.info(`Loading accessory from cache: ${accessory.displayName} (${accessory.context?.device?.model || "unknown"})`);

        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this.agent.PushAccessory(accessory);
    }
}
