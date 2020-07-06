import { ErrorMapper } from "utils/ErrorMapper";
import * as Spawner from "misc/spawner";
import * as RoleTransportSpawn from "role/transport.spawn";
import * as RoleTransportRange from "role/transport.range";
import * as RoleTransportTower from "role/transport.tower";
import * as RoleUpgrader from "role/upgrader";
import * as RoleBuilder from "role/builder";
import * as RoleRepairer from "role/repairer";
import * as RoleMinerEnergy from "role/miner.energy";
import * as RoleScout from "role/scout";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
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
var updateDataTimer = 100;
export const loop = ErrorMapper.wrapLoop(() => {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    var startGlobal = new Date().getTime();
    // delete Memory.scoutData;
    if (Memory.scoutData == null) {
        Memory.scoutData = {};
    }
    if (Memory.insufficentFarmRoute == null) {
        Memory.insufficentFarmRoute = {};
    }
    if (Memory.sufficentFarmRoute == null) {
        Memory.sufficentFarmRoute = {};
    }

    if (Memory.rangeFarmRange == null) {
        Memory.rangeFarmRange = 0;
    }
    if (Memory.rangeFarmData == null) {
        Memory.rangeFarmData = {};
    }

    if (updateDataTimer > 60) {
        var filteredRangeData: any = {};
        Object.keys(Memory.scoutData)
            .filter((x) => {
                let route = Game.map.findRoute(Memory.scoutData[x].room, Game.spawns.Spawn1.room.name);
                if (route != -2) {
                    return route.length <= Memory.rangeFarmRange && Memory.scoutData[x].sources.length >= 1;
                } else {
                    return false;
                }
            })
            .sort((a, b) => {
                if (Memory.scoutData[a].distanceToBase.length < Memory.scoutData[b].distanceToBase.length) return -1;
                if (Memory.scoutData[a].distanceToBase.length > Memory.scoutData[b].distanceToBase.length) return 1;
                return 0;
            })
            .forEach(function (room) {
                filteredRangeData[room] = Memory.scoutData[room];
            });
        Memory.rangeFarmData = filteredRangeData;

        updateDataTimer = 0;
    } else {
        updateDataTimer++;
    }

    for (var name in Game.rooms) {
        //   console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
        var towers = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TOWER && structure.store.energy > 0;
            }
        });
        if (towers.length > 0) {
            var towerRange = 5000;
            if (towers.length > 1) {
                let towerDist = towers[0].pos.getRangeTo(towers[1]);
                console.log(towerDist);
                towerRange = towers[0].pos.getRangeTo(towers[1]) - towerDist / 3;
            }

            console.log(towerRange);
            towers.forEach((towerSt) => {
                let tower = towerSt as StructureTower;
                if (tower) {
                    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (closestHostile) {
                        tower.attack(closestHostile);
                    } else {
                        if (tower.store[RESOURCE_ENERGY] > 500) {
                            var damagedStructure = tower.room.find(FIND_STRUCTURES, {
                                filter: (structure: any) =>
                                    structure.hits < structure.hitsMax &&
                                    structure.hits < 400000 &&
                                    tower.pos.getRangeTo(structure) < towerRange
                            });
                            damagedStructure = damagedStructure.sort(function (a, b) {
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

                            if (damagedStructure.length > 0) {
                                tower.repair(damagedStructure[0]);
                            }
                        }
                    }
                }
            });
        }
    }
    {
        var start = new Date().getTime();
        for (var spawn in Game.spawns) {
            Spawner.Spawn(Game.spawns[spawn]);
        }
        var end = new Date().getTime();
        var time = end - start;
        // console.log('Spawner Execution time: ' + time);
    }

    {
        var start = new Date().getTime();
        //   var zeit0 = performance.now();
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == "transport.spawn") {
                RoleTransportSpawn.Run(creep);
            }
            if (creep.memory.role == "upgrader") {
                RoleUpgrader.Run(creep);
            }
            if (creep.memory.role == "builder") {
                RoleBuilder.Run(creep);
            }
            if (creep.memory.role == "repairer") {
                RoleRepairer.Run(creep);
            }
            if (creep.memory.role == "miner.energy") {
                RoleMinerEnergy.Run(creep);
            }
            if (creep.memory.role == "transport.range") {
                RoleTransportRange.Run(creep);
            }
            if (creep.memory.role == "transport.tower") {
                RoleTransportTower.Run(creep);
            }

            if (creep.memory.role == "scout") {
                RoleScout.Run(creep);
            }
        }
        var end = new Date().getTime();
        var time = end - start;
        //      console.log('Creep Execution time: ' + time);*
    }
    Object.keys(Memory.rangeFarmData).forEach(function (room) {
        defendRoom(room);
    });

    var endGlobal = new Date().getTime();
    var timeGlobal = endGlobal - startGlobal;
    Game.spawns.Spawn1.room.visual.text("📌 Performance: " + timeGlobal + " ms", 0, 11, {
        align: "left",
        opacity: 1,
        color: "#FFFFFF"
    });
    Game.spawns.Spawn1.room.visual.text("📌 Creeps: " + Object.keys(Memory.creeps).length, 0, 12, {
        align: "left",
        opacity: 1,
        color: "#FFFFFF"
    });
    Game.spawns.Spawn1.room.visual.text("📌 Ranged Rooms: " + Object.keys(Memory.rangeFarmData).length, 0, 13, {
        align: "left",
        opacity: 1,
        color: "#FFFFFF"
    });
    Game.spawns.Spawn1.room.visual.text("📌 Farm Range: " + Memory.rangeFarmRange, 0, 15, {
        align: "left",
        opacity: 1,
        color: "#FFFFFF"
    });
});

function defendRoom(roomName: string) {
    if (Game.rooms[roomName] != undefined) {
        var defenders = _.filter(
            Game.creeps,
            (creep) =>
                creep.memory.role == "defender" ||
                creep.memory.role == "defender_range" ||
                creep.memory.role == "defender_heal"
        );

        defenders.forEach((defender) => {
            if (defender.memory.attackTarget != null) {
                var enemy: any = Game.getObjectById(defender.memory.attackTarget);
                if (enemy != null) {
                    if (defender.memory.role == "defender") {
                        defender.attack(enemy);
                        defender.moveTo(enemy, { visualizePathStyle: { stroke: "#FF0000" } });
                    } else if (defender.memory.role == "defender_range") {
                        defender.rangedAttack(enemy);
                        defender.moveTo(enemy, { visualizePathStyle: { stroke: "#FF0000" } });
                    } else if (defender.memory.role == "defender_heal") {
                        var heal = defenders.filter((x) => x.hits < x.hitsMax);
                        if (defender.heal(heal[0]) == ERR_NOT_IN_RANGE) {
                            defender.moveTo(heal[0], { visualizePathStyle: { stroke: "#FF0000" } });
                        }
                    }
                } else {
                    defender.memory.attackTarget = null;
                }
            } else {
                var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
                if (hostiles.length > 0) {
                    defender.memory.attackTarget = hostiles[0].id;
                } else {
                    defender.moveTo(Game.flags.MainDefence, { visualizePathStyle: { stroke: "#FF0000" } });
                }
            }
        });
    }
}
