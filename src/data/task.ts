const JOB_FARM_ENERGY = "job_farm_energy";
const JOB_REPAIR = "job_repair";
const JOB_BUILD = "job_build";
const JOB_SPAWN = "job_spawn";
const JOB_CONTROLLER = "job_controller";

export module Task {
    export function Init() {
        if (Memory.Controller == null) {
            Memory.Controller = {};
        }
        if (Memory.Controller.Task == null) {
            Memory.Controller.Task = [];
            console.log("Init TaskController");
        }
    }

    export function Add(role: CreepRole, room: string) {
        STRUCTURE_CONTAINER;
        Memory.Controller.Spawn.push({ role: role, room: room });
        Memory.Controller.Spawn = Memory.Controller.Spawn.sort((a: any, b: any) => {
            if (BaseSettings.RoleOrder[a.role] < BaseSettings.RoleOrder[b.role]) {
                return -1;
            }
            if (BaseSettings.RoleOrder[a.role] > BaseSettings.RoleOrder[b.role]) {
                return 1;
            }
            return 0;
        });
    }
}
