export enum CreepRole {
    MINER,
    TRANSPORTER,
    WORKER,
    SCOUT
}

export class BaseRole {
    creep: Creep;
    constructor(creep: Creep) {
        this.creep = creep;
    }

    tick() {
        
    }
}
