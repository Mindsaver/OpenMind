export enum CreepRole {
    MINER,
    TRANSPORTER,
    WORKER,
    SCOUT,
    UNKOWN = 999
}

export class BaseRole {
    creepName: string;
    role: CreepRole = CreepRole.UNKOWN;
    masterRoom: string;
    constructor(creep: string, masterRoom: string) {
        this.creepName = creep;
        this.masterRoom = masterRoom;
    }

    test() {
        console.log("BASE ROLE TEST: " + this.creepName);
    }

    Tick() {
        console.log("TICK:" + this.creepName);
        //console.log("TICK");
    }
}
