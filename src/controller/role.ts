import { BaseRole, CreepRole } from "role/base";
import { Worker } from "role/worker";

export module RoleController {
    export function Run(creep: Creep) {
        var role: CreepRole = <CreepRole>(<unknown>creep.memory.role);
        if (role == CreepRole.WORKER) {
            console.log("WORKER");
            new Worker(creep).Tick();
        } else if (role == CreepRole.MINER) {
            console.log("MINER");
        } else if (role == CreepRole.TRANSPORTER) {
            console.log("TRANSPORTER");
        } else if (role == CreepRole.SCOUT) {
            console.log("SCOUT");
        }
    }
}
