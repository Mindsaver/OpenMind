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
        creep.say("🚧 build");
    }

    if (creep.memory.working) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
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
                    return (
                        (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity() > 400) ||
                        (structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity() > 50000)
                    );
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
