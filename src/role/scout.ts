import { BaseRole, CreepRole } from "./base";

export class Scout extends BaseRole {
    constructor(creep: string, masterRoom: string) {
        super(creep, masterRoom);
        this.role = CreepRole.SCOUT;
    }
}
