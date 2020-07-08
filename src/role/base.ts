export enum CreepRole {
    MINER,
    TRANSPORTER,
    WORKER,
    SCOUT
}

export class BaseRole {
    creep: Creep;
    constructor(creep: Creep) {
        //   console.log("BASE");
        this.creep = creep;
    }

    Tick() {
        //   console.log("TICK");
    }
}
