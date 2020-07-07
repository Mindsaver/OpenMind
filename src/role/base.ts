export enum CreepRole {
    MINER,
    TRANSPORTER,
    WORKER,
    SCOUT
}

export class BaseRole {
    creep: Creep;
    isFull: boolean;
    isWorking: boolean;
    workPosition: RoomPosition | null;
    otherPosition:RoomPosition | null;
    constructor(creep: Creep) {
        console.log("BASE");
        this.creep = creep;
        this.isFull = false;
        this.isWorking = false;
        this.workPosition = null;
        this.otherPosition = null;
    }

    Tick() {
        if()
        console.log("TICK");
    }
}
