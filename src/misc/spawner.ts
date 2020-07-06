var creepBodyParts: any = {
    move: 50,
    work: 100,
    carry: 50,
    attack: 80,
    ranged_attack: 150,
    heal: 250,
    claim: 600,
    tough: 10
};

var creepSettings: any = {
    miner: {
        base: [CARRY, MOVE, WORK],
        extensions: [WORK],
        max: 700
    },
    miner_range: {
        base: [MOVE, MOVE, MOVE, WORK, WORK, WORK],
        extensions: [],
        max: 700
    },

    transport: {
        base: [MOVE, CARRY],
        extensions: [MOVE, CARRY, CARRY],
        max: 700
    },
    transport_range: {
        base: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
        extensions: [],
        max: 700
    },
    builder: {
        base: [MOVE, MOVE, WORK, CARRY],
        extensions: [MOVE, CARRY, MOVE, CARRY, MOVE, WORK],
        max: 900
    },
    transport_build: {
        base: [MOVE, CARRY, WORK],
        extensions: [MOVE, CARRY, MOVE, WORK],
        max: 1000
    },
    scout: {
        base: [MOVE],
        extensions: [],
        max: 700
    },
    defender: {
        base: [MOVE, MOVE, MOVE, TOUGH, TOUGH, ATTACK, ATTACK],
        extensions: [MOVE, MOVE, TOUGH, ATTACK],
        max: 1100
    },
    defender_range: {
        base: [MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK],
        extensions: [MOVE, MOVE, TOUGH, RANGED_ATTACK],
        max: 1100
    },
    defender_heal: {
        base: [MOVE, MOVE, HEAL, HEAL],
        extensions: [MOVE, HEAL],
        max: 1100
    }
};

function calcBaseCost(creep: any) {
    var cost = 0;
    creepSettings[creep].base.forEach((body: any) => {
        cost += creepBodyParts[body];
    });
    return cost;
}

function getBodyParts(creep: any, maxEnergy: number) {
    let cost = calcBaseCost(creep);
    let bodyModules = creepSettings[creep].base;
    if (maxEnergy > creepSettings[creep].max) {
        maxEnergy = creepSettings[creep].max;
    }
    while (true) {
        var changed = false;
        creepSettings[creep].extensions.forEach((body: any) => {
            if (cost + creepBodyParts[body] <= maxEnergy) {
                cost += creepBodyParts[body];
                bodyModules.push(body);
                changed = true;
            }
        });
        if (!changed) {
            break;
        }
    }
    return bodyModules;
}

export const Spawn = function (spawn: StructureSpawn) {
    //   Memory.rangeFarmRange = 1;
    var rangeFarmRange = Memory.rangeFarmRange;
    if (spawn.room.controller)
        if (spawn.room.controller.level >= 3 && rangeFarmRange == 0) {
            Memory.rangeFarmRange = 1;
        }

    if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text("🛠️ " + spawn.spawning.name, spawn.pos.x + 1, spawn.pos.y, {
            align: "left",
            opacity: 0.8
        });
    }

    spawn.room.visual.text(
        "⭐ Energy: " + spawn.room.energyAvailable + "/" + spawn.room.energyCapacityAvailable,
        0,
        14,
        {
            align: "left",
            opacity: 1,
            color: "#FFFFFF"
        }
    );

    var currentCreepCount = spawn.room.find(FIND_MY_CREEPS).length;
    if (spawn.memory.currentCreeps == 0 || spawn.memory.currentCreeps < currentCreepCount) {
        spawn.memory.currentCreeps = spawn.room.find(FIND_MY_CREEPS).length;
    }
    var maxEnergy: number = spawn.room.energyCapacityAvailable;

    var miners = _.filter(
        Game.creeps,
        (creep: Creep) =>
            creep.memory.role == "miner.energy" &&
            creep.memory.room == spawn.room.name &&
            creep.ticksToLive &&
            creep.ticksToLive > 100
    );
    var harvesters = _.filter(
        Game.creeps,
        (creep) => creep.memory.role == "transport.spawn" && creep.memory.room == spawn.room.name
    );
    if (miners.length < 1 || harvesters.length < 1) {
        maxEnergy = 300;
        console.log("ALARMALARMALARM MAX ENGERY NOW 300");
    }

    if (miners.length < 2) {
        var newName = "Miner.Energy" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("miner", maxEnergy), newName, {
            memory: { role: "miner.energy", room: spawn.room.name, spawn: spawn }
        });
        return;
    }

    if (harvesters.length < 3) {
        var newName = "Transport Spawn" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("transport", maxEnergy), newName, {
            memory: { role: "transport.spawn", room: spawn.room.name, spawn: spawn }
        });

        return;
    }

    var transportsTower = _.filter(Game.creeps, (creep) => creep.memory.role == "transport.tower");

    if (transportsTower.length < 2) {
        var newName = "Transport Tower #" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("transport", maxEnergy), newName, {
            memory: { role: "transport.tower", spawn: spawn }
        });
        return;
    }

    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == "defender");

    if (defenders.length < 2) {
        var newName = "Defender Melee #" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("defender", maxEnergy), newName, {
            memory: { role: "defender", spawn: spawn }
        });
        return;
    }

    var defendersRange = _.filter(Game.creeps, (creep) => creep.memory.role == "defender_range");

    if (defendersRange.length < 1) {
        var newName = "Defender Range #" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("defender_range", maxEnergy), newName, {
            memory: { role: "defender_range", spawn: spawn }
        });
        return;
    }
    var defendersHeal = _.filter(Game.creeps, (creep) => creep.memory.role == "defender_heal");

    if (defendersHeal.length < 0) {
        var newName = "Defender Heal #" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("defender_heal", maxEnergy), newName, {
            memory: { role: "defender_heal", spawn: spawn }
        });
        return;
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader");

    if (upgraders.length < 5) {
        var newName = "Upgrader" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("transport_build", maxEnergy), newName, {
            memory: { role: "upgrader", room: spawn.room.name, spawn: spawn }
        });
        return;
    }
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder");

    if (builders.length < 2) {
        var newName = "Builder" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("builder", maxEnergy), newName, {
            memory: { role: "builder", room: spawn.room.name, spawn: spawn }
        });
        return;
    }

    var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == "repairer");

    if (repairer.length < 2) {
        var newName = "Repairer" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("transport_build", maxEnergy), newName, {
            memory: { role: "repairer", room: spawn.room.name, spawn: spawn }
        });
        return;
    }
    var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == "scout");

    if (scouts.length < 10) {
        var newName = "Scout" + Game.time;
        console.log("Spawning new creep: " + newName);
        spawn.spawnCreep(getBodyParts("scout", maxEnergy), newName, {
            memory: { role: "scout", spawn: spawn }
        });
        return;
    }

    var BreakException = {};
    try {
        Object.keys(Memory.rangeFarmData).forEach(function (room) {
            if (room != spawn.room.name) {
                var rangeMiners = _.filter(
                    Game.creeps,
                    (creep: Creep) =>
                        creep.memory.role == "miner.energy" &&
                        creep.memory.room == room &&
                        creep.ticksToLive &&
                        creep.ticksToLive > 100
                );
                //
                if (rangeMiners.length < Memory.scoutData[room].sources.length) {
                    var newName = "Range Miner Energy (" + room + ") #" + Game.time;
                    //  console.log('Spawning new creep: ' + newName);
                    spawn.spawnCreep(getBodyParts("miner_range", maxEnergy), newName, {
                        memory: { role: "miner.energy", room: room, energyUsed: maxEnergy, spawn: spawn }
                    });
                    throw BreakException;
                }
                var rangeTransporters = _.filter(
                    Game.creeps,
                    (creep) =>
                        creep.memory.role == "transport.range" &&
                        creep.memory.room == room &&
                        creep.ticksToLive &&
                        creep.ticksToLive > 100
                );
                if (
                    rangeTransporters.length <
                    Memory.scoutData[room].sources.length * 2 + (Memory.scoutData[room].distanceToBase.length - 1)
                ) {
                    var newName = "Range Transport (" + room + ") #" + Game.time;
                    //   console.log('Spawning new creep: ' + newName);
                    spawn.spawnCreep(getBodyParts("transport_range", maxEnergy), newName, {
                        memory: { role: "transport.range", room: room, energyUsed: maxEnergy, spawn: spawn }
                    });

                    throw BreakException;
                }
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
        return;
    }

    console.log("end");
    if (Object.keys(Memory.rangeFarmData).length > 0) {
        Memory.rangeFarmRange = 2;
        console.log("EXTENDED to:" + Memory.rangeFarmRange);
    }

    /*     */
};
