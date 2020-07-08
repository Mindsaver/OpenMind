import { Room } from "data/room";
import { SpawnData } from "data/spawn";
import { BaseSettings } from "config/base";

export module SpawnController {
    export function Run() {
        SpawnData.Init();
        var spawns = _.map(Game.spawns);

        spawns.forEach((spawn: any) => {
            var spawnDataList = SpawnData.GetList(spawn.room.name);
            console.log("CREEPS TO SPAWN: " + spawnDataList.length);
            for (let x = 0; x < spawnDataList.length; x++) {
                var spawnData = spawnDataList[x];
                var name = BaseSettings.CreepName[spawnData.role] + " #" + Game.time;

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
