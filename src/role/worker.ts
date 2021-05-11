import { BaseRole, CreepRole } from "./base";

export class Worker extends BaseRole {
    subTestVar: string = "test";
    constructor(creep: string, masterRoom: string) {
        super(creep, masterRoom);
        this.role = CreepRole.WORKER;
    }

    test() {
        console.log("WORKER ROLE TEST: " + this.subTestVar);
        super.test();
    }
    Tick() {
        super.Tick();
    }
}
