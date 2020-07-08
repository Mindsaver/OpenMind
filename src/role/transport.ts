import { BaseRole, CreepRole } from "./base";

export class Transport extends BaseRole {
    constructor(creep: string, masterRoom: string) {
        super(creep, masterRoom);
        this.role = CreepRole.TRANSPORTER;
    }
}
