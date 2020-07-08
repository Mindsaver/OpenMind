import { BaseRole, CreepRole } from "./base";

export class Miner extends BaseRole {
    constructor(creep: string, masterRoom: string) {
        super(creep, masterRoom);
        this.role = CreepRole.MINER;
    }
}
