import { Room } from "data/room";
import { SpawnData } from "data/spawn";
import { BaseSettings } from "config/base";
import { RoleController } from "controller/role";

export module SpawnController {
    export function Run() {
        if (SpawnData.Init()) {
            return;
        }
        var spawns = _.map(Game.spawns);

        spawns.forEach((spawn: any) => {
            var spawnDataList = SpawnData.GetList(spawn.room.name);
            console.log("CREEPS TO SPAWN: " + spawnDataList.length);
            if (spawnDataList.length > 0) {
                var spawnData = spawnDataList[0];
                var name = BaseSettings.CreepName[spawnData.role] + " #" + Game.time;

                var roleClass = RoleController.createRole(spawnData.role, name, spawn.room.name);
                if (roleClass == null) return;
                //CHECK IF CREEP COULD BE SPAWNED BEFORE AND IF YES CREATE ROLECLASS
                if (
                    spawn.spawnCreep([MOVE], name, {
                        memory: roleClass
                    }) == 0
                ) {
                    console.log("REMOVE: role:" + spawnData.role + " ROOM: " + spawn.room.name);
                    SpawnData.RemoveAtPosition(0);
                    Room.AddCreep(spawn.room.name, name);
                    return;
                } else {
                    return;
                }
            }
        });
    }
}

/*class OMStructureSpawn extends StructureSpawn {
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
*/
