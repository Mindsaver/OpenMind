export const Run = function (creep: Creep) {
    if (creep.memory.isTransporting == null) {
        creep.memory.isTransporting = false;
    }
    if (creep.memory.transportedEngergy == null) {
        creep.memory.transportedEngergy = 0;
    }
    if (creep.ticksToLive == 1) {
        console.log("TRANSPORT STATS ROOM: " + creep.memory.room + " Energy: " + creep.memory.transportedEngergy);

        if (creep.memory.energyUsed != null) {
            if (creep.memory.energyUsed > creep.memory.transportedEngergy) {
                console.log("ALARMALARM CREEP INSUFFICENT" + creep.memory.room);
                if (creep.memory.room) {
                    if (Memory.insufficentFarmRoute[creep.memory.room] == null) {
                        Memory.insufficentFarmRoute[creep.memory.room] = 1;
                    } else {
                        Memory.insufficentFarmRoute[creep.memory.room] =
                            Memory.insufficentFarmRoute[creep.memory.room] + 1;
                    }
                }
                //TODO BLACKLIST ROOM NOT EFFICENT!!!!
            } else {
                if (creep.memory.room) {
                    if (Memory.sufficentFarmRoute[creep.memory.room] == null) {
                        Memory.sufficentFarmRoute[creep.memory.room] = creep.memory.transportedEngergy;
                    } else {
                        Memory.sufficentFarmRoute[creep.memory.room] =
                            (Memory.sufficentFarmRoute[creep.memory.room] + creep.memory.transportedEngergy) / 2;
                    }
                }
            }
        }
    }
    if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() && !creep.memory.isTransporting) {
        creep.memory.isTransporting = true;
    }

    if (creep.room.name != creep.memory.room && !creep.memory.isTransporting && creep.memory.room) {
        // console.log('Moving to Ressource Room');
        creep.moveTo(new RoomPosition(25, 25, creep.memory.room), { visualizePathStyle: { stroke: "#0000FF" } });
        return;
    }
    if (creep.room.name == creep.memory.room && !creep.memory.isTransporting) {
        let target: any = creep.pos.findClosestByRange(FIND_TOMBSTONES);
        if (target == null) {
            target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: (structure) => {
                    return structure.amount > 300;
                }
            });
        }

        if (target != null) {
            //  console.log(target2);
            if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                //   console.log('Moving to Dropped Ressources');
                creep.moveTo(target, { visualizePathStyle: { stroke: "#0000FF" } });
            }
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.isTransporting = true;
            }
        } else {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            creep.moveTo(new RoomPosition(25, 25, creep.memory.room), {
                visualizePathStyle: { stroke: "#0000FF" }
            });
            //  creep.moveTo(source, { stroke: '#0000ff' });
        }
        return;
    }

    if (creep.room.name != Game.spawns.Spawn1.room.name && creep.memory.isTransporting) {
        // console.log('Moving to Spawn Room');
        creep.moveTo(new RoomPosition(25, 25, Game.spawns.Spawn1.room.name), {
            visualizePathStyle: { stroke: "#0000FF" }
        });
        return;
    }
    if (creep.room.name == Game.spawns.Spawn1.room.name && creep.memory.isTransporting) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE;
            }
        });
        if (target == null) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });
        }

        //console.log(target);
        if (target != null) {
            const range = creep.pos.getRangeTo(target);
            var creepEnergy = creep.store[RESOURCE_ENERGY];
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: "#0000FF" } });
            } else {
                creep.memory.transportedEngergy += creepEnergy;
                //  console.log('Packing in container');
                creep.memory.isTransporting = false;
            }
        }
        return;
    }
};
