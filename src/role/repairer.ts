var StructerRepairOrder: any = {
    spawn: 0,
    extension: 10,
    road: 20,
    controller: 30,
    storage: 40,
    container: 50,
    rampart: 100,
    keeperLair: 120,
    portal: 140,
    link: 160,
    observer: 180,
    powerBank: 200,
    powerSpawn: 210,
    extractor: 220,
    lab: 230,
    terminal: 240,
    nuker: 250,
    invaderCore: 260,
    factory: 270,
    tower: 999,
    constructedWall: 9999
};

export const Run = function (creep: Creep) {
    if (creep.memory.working == null) {
        creep.memory.working = false;
    }
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
        creep.say("🔄 harvest");
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = true;
        creep.say("🚧 repairing");
    }

    if (creep.memory.working) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
        targets = targets.sort(function (a, b) {
            if (StructerRepairOrder[a.structureType] < StructerRepairOrder[b.structureType]) {
                return -1;
            }
            if (StructerRepairOrder[a.structureType] > StructerRepairOrder[b.structureType]) {
                return 1;
            }
            if (a.hits + 2000 < b.hits) {
                return -1;
            }
            if (a.hits > b.hits + 2000) {
                return 1;
            }
            return 0;
        });
        if (targets.length > 0) {
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffaa00" } });
            } else {
                creep.memory.target = null;
            }
        } else {
            creep.moveTo(Game.flags.Sleep, { visualizePathStyle: { stroke: "#ffffff" } });
        }
    } else {
        if (creep.memory.target == null) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity() > 400;
                }
            });
            creep.memory.target = target;
        }
        if (creep.memory.target != null) {
            let target: AnyStructure | null = Game.getObjectById(creep.memory.target.id);
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            let target: Resource | null = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};
