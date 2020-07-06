var storageStructures: any = {
    spawn: 0,
    extension: 10,
    tower: 999
};
export const Run = function (creep: Creep) {
    if (creep.memory.working == null) {
        creep.memory.working = true;
    }
    if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = true;
        creep.say("🔄 harvest");
    }
    if (creep.memory.working && creep.store.getFreeCapacity() == 0) {
        creep.memory.working = false;
        creep.say("🚧 Store");
    }

    if (creep.memory.working) {
        if (creep.memory.target == null) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity() > 100) ||
                        (structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity() > 100)
                    );
                }
            });
            creep.memory.target = target;
        }
        if (creep.memory.target != null) {
            let target: AnyStructure | null = Game.getObjectById(creep.memory.target.id);
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: { stroke: "#ffffff" }
                    });
                }
            }
        } else {
            let target: Resource | null = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        visualizePathStyle: { stroke: "#ffffff" }
                    });
                }
            }
        }
    } else {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            }
        });

        targets = targets.sort(function (a, b) {
            if (storageStructures[a.structureType] < storageStructures[b.structureType]) {
                return -1;
            }
            if (storageStructures[a.structureType] > storageStructures[b.structureType]) {
                return 1;
            }
            return 0;
        });

        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
            } else {
                creep.memory.target = null;
            }
        } else {
            creep.moveTo(Game.flags.Sleep, { visualizePathStyle: { stroke: "#ffffff" } });
        }
    }
};
