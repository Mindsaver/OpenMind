import { BaseRole, CreepRole } from "role/base";
import { Worker } from "role/worker";

export const Run = function (creep: Creep) {
    switch (creep.memory.role) {
        case CreepRole.WORKER: {
            new Worker(creep).tick();
            break;
        }
        case CreepRole.MINER: {
            //new Worker(creep).tick();
            break;
        }
        case CreepRole.TRANSPORTER: {
            break;
        }
        case CreepRole.SCOUT: {
            break;
        }
    }
};
