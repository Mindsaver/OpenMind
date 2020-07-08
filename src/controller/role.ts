import { CreepRole, BaseRole } from "role/base";
import { Worker } from "role/worker";
import { Scout } from "role/scout";
import { Miner } from "role/miner";
import { Transport } from "role/transport";
export module RoleController {
    export function createRole(role: CreepRole, creepName: string, room: string) {
        if (role == CreepRole.WORKER) {
            //  console.log("WORKER");
            return new Worker(creepName, room);
        } else if (role == CreepRole.MINER) {
            //     console.log("MINER");
            return new Miner(creepName, room);
        } else if (role == CreepRole.TRANSPORTER) {
            //    console.log("TRANSPORTER");
            return new Transport(creepName, room);
        } else if (role == CreepRole.SCOUT) {
            //     console.log("SCOUT");
            return new Scout(creepName, room);
        }
        return null;
    }

    export function GetCreepClass(creep: Creep): Worker | Miner | Transport | Scout | null {
        var creepClass: any = creep.memory;
        if (creepClass == undefined) return null;

        if (creepClass.role == CreepRole.WORKER) {
            creepClass.__proto__ = Worker.prototype;
            return <Worker>creepClass;
        } else if (creepClass.role == CreepRole.MINER) {
            creepClass.__proto__ = Miner.prototype;
            return <Miner>creepClass;
        } else if (creepClass.role == CreepRole.TRANSPORTER) {
            creepClass.__proto__ = Transport.prototype;
            return <Transport>creepClass;
        } else if (creepClass.role == CreepRole.SCOUT) {
            creepClass.__proto__ = Scout.prototype;
            return <Scout>creepClass;
        }
        return null;
    }

    /*export function Run(creep: Creep) {
        var role: CreepRole = <CreepRole>(<unknown>creep.memory.role);
        if (role == CreepRole.WORKER) {
            //  console.log("WORKER");
            new Worker(creep).Tick();
        } else if (role == CreepRole.MINER) {
            //     console.log("MINER");
        } else if (role == CreepRole.TRANSPORTER) {
            //    console.log("TRANSPORTER");
        } else if (role == CreepRole.SCOUT) {
            //     console.log("SCOUT");
        }
    }*/
}
