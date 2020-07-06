function storeExplorationInfo(creep: Creep) {
    try {
        var scoutData = {
            room: creep.room.name,
            sources: creep.room.find(FIND_SOURCES),
            minerals: creep.room.find(FIND_MINERALS),
            hostileCreeps: creep.room.find(FIND_HOSTILE_CREEPS).length,
            hostileStructures: creep.room.find(FIND_HOSTILE_STRUCTURES).length,
            hostileSpawns: creep.room.find(FIND_HOSTILE_SPAWNS).length,
            hostileConstructions: creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES).length,
            distanceToBase: Game.map.findRoute(Game.spawns["Spawn1"].room, creep.room)
        };
        // console.log(scoutData.distanceToBase.length);
        if (Memory.scoutData[creep.room.name] == null) {
            console.log("NEW ROOM DISCOVERED: " + creep.room.name);
        }
        Memory.scoutData[creep.room.name] = scoutData;
    } catch (error) {}
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const Run = function (creep: Creep) {
    if (creep.memory.nextRoom == creep.room.name || creep.memory.nextRoom == undefined) {
        //   console.log('Test');
        storeExplorationInfo(creep);
        var exits = Game.map.describeExits(creep.room.name);
        var countExits = 0;
        if (exits["1"]) {
            countExits++;
        }
        if (exits["3"]) {
            countExits++;
        }
        if (exits["5"]) {
            countExits++;
        }
        if (exits["7"]) {
            countExits++;
        }

        var exitID = getRandomInt(0, countExits);
        //   console.log(exitID);
        // console.log('OLD ROOM:' + creep.memory.nextRoom);
        if (exitID == 0) {
            creep.memory.nextRoom = exits["1"];
        } else if (exitID == 1) {
            creep.memory.nextRoom = exits["3"];
        } else if (exitID == 2) {
            creep.memory.nextRoom = exits["5"];
        } else if (exitID == 3) {
            creep.memory.nextRoom = exits["7"];
        }
        // console.log('NEW ROOM:' + creep.memory.nextRoom);
    }

    if (creep.room.name != creep.memory.nextRoom && creep.memory.nextRoom != undefined) {
        if (typeof creep.memory.nextRoom == "object") {
            creep.memory.nextRoom == undefined;
            return;
        }
        creep.moveTo(new RoomPosition(25, 25, creep.memory.nextRoom), {
            visualizePathStyle: { stroke: "#0000FF" }
        });
    }
};
