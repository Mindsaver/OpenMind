import { CreepRole } from "role/base";
import { Room } from "controller/room";
import { BaseSettings } from "config/base";
var baseSetting: any = _.map(BaseSettings);

export module SpawnData {
    export function Init() {
        if (Memory.Controller == null) {
            Memory.Controller = {};
        }
        if (Memory.Controller.Spawn == null) {
            Memory.Controller.Spawn = [];
            console.log("Init SpawnController");
        }
    }
    export function Add(role: CreepRole, room: string) {
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
    export function CountRole(role: CreepRole, room: string) {
        var roles = Memory.Controller.Spawn.filter((x: any) => x.role == role && x.room == room);
        console.log("room:" + room + " role:" + role + " count:" + roles.length);
        return roles.length;
    }
    export function GetList(room: string) {
        return Memory.Controller.Spawn.filter((x: any) => x.room == room);
    }
    export function RemoveAtPosition(position: number) {
        console.log("POSITION" + position);
        if (position > -1) {
            Memory.Controller.Spawn.splice(position, 1);
        }
    }
}

export module SpawnController {
    export function Run() {
        SpawnData.Init();
        var spawns = _.map(Game.spawns);

        spawns.forEach((spawn: any) => {
            var spawnDataList = SpawnData.GetList(spawn.room.name);
            console.log("CREEPS TO SPAWN: " + spawnDataList.length);
            for (let x = 0; x < spawnDataList.length; x++) {
                var spawnData = spawnDataList[x];
                var name = "Creep Type:" + spawnData.role + " #" + Game.time;

                if (spawn.spawnCreep([MOVE], name, { memory: { room: spawn.room.name, role: spawnData.role } }) == 0) {
                    console.log("REMOVE: role:" + spawnData.role + " ROOM: " + spawn.room.name);
                    SpawnData.RemoveAtPosition(x);
                    Room.AddCreep(spawn.room.name, name, spawnData.role);
                    break;
                } else {
                    break;
                }
            }
        });
    }
}

class OMStructureSpawn extends StructureSpawn {
    constructor(id: Id<StructureSpawn>) {
        super(id);
    }

    spawnCreep(body: BodyPartConstant[], name: string, opts?: SpawnOptions) {
        var ret: ScreepsReturnCode = super.spawnCreep(body, name, undefined);

        //Game.creeps[name].role = opts?.role;
        return ret;
    }
}
export const Spawn = function (spawn: StructureSpawn) {
    var currentCreepCount = spawn.room.find(FIND_MY_CREEPS).length;
    if (currentCreepCount > 0) return;
    var spawnOM = new OMStructureSpawn(spawn.id);

    spawnOM.spawnCreep([MOVE], "BLABLA");
};
