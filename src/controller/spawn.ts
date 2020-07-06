export const Spawn = function (spawn: StructureSpawn) {
    var currentCreepCount = spawn.room.find(FIND_MY_CREEPS).length;
    if (currentCreepCount > 0) return;
    var spawnOM = new OMStructureSpawn(spawn.id);

    spawnOM.spawnCreep([MOVE], "BLABLA");
};

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
