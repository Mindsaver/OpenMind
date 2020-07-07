import { Init } from "./road";

import { CreepRole } from "role/base";
import { SpawnData } from "controller/spawn";
import { RoleController } from "controller/role";

import { BaseSettings } from "config/base";
import { Console } from "console";

interface Outpost {
    name: string;
    ressources: Ressource[];
}

interface Ressource {
    pos: RoomPosition;
    cost: number;
    type: string;
}

interface Building {
    pos: RoomPosition;
    type: string;
}
interface CreepData {
    name: string;
    birth: number;
    role: CreepRole;
}

interface RoomData {
    name: string;
    creeps: CreepData[];
    ressources: Ressource[];
    buildings: Building[];
    outposts: Outpost[];
}

export module Room {
    export function Init() {
        if (Memory.Controller == null) {
            Memory.Controller = {};
        }
        if (Memory.Controller.Rooms == null) {
            Memory.Controller.Rooms = {};
            console.log("Init RoomController");
            Room.Add(Game.spawns.Spawn1.room.name);
        }
    }
    export function Add(room: string) {
        //FIXME ADD ME LATER
        if (Memory.Controller.Rooms[room] != undefined) return;
        var spawns: StructureSpawn[] = _.map(Game.rooms[room].find(FIND_MY_SPAWNS));
        let sources: Source[] = _.map(spawns[0].room.find(FIND_SOURCES));
        console.log(JSON.stringify(sources));
        let minerals: Mineral[] = _.map(spawns[0].room.find(FIND_MINERALS));

        let basePositions: RoomPosition[] = [];
        BaseSettings.RoadPos.forEach((pos: any) => {
            basePositions.push(new RoomPosition(spawns[0].pos.x + pos.x, spawns[0].pos.y + pos.y, room));
        });

        var ressources: Ressource[] = [];
        sources.forEach((source) => {
            var t = PathFinder.search(source.pos, basePositions);
            t.path.forEach((path) => {
                Game.rooms[room].visual.circle(path.x, path.y);
            });
            ressources.push({ pos: source.pos, cost: t.cost, type: RESOURCE_ENERGY });
        });

        minerals.forEach((mineral) => {
            var t = PathFinder.search(mineral.pos, basePositions);
            t.path.forEach((path) => {
                Game.rooms[room].visual.circle(path.x, path.y);
            });
            ressources.push({ pos: mineral.pos, cost: t.cost, type: mineral.mineralType });
        });
        var roomData: RoomData = {
            name: room,
            creeps: [],
            ressources: ressources,
            buildings: [],
            outposts: []
        };
        Memory.Controller.Rooms[room] = roomData;
    }

    export function AddCreep(room: string, creep: string, role: CreepRole) {
        if (Memory.Controller.Rooms[room] == undefined) return;
        var creepData: CreepData = {
            name: creep,
            birth: Game.time,
            role: role
        };
        Memory.Controller.Rooms[room].creeps.push(creepData);
    }
    export function RemoveCreepAtPos(room: string, position: number) {
        if (Memory.Controller.Rooms[room] == undefined) return;
        if (position > -1) {
            Memory.Controller.Rooms[room].creeps.splice(position, 1);
        }
    }

    export function GetList(): RoomData[] {
        return _.map(Memory.Controller.Rooms);
    }
}

export module RoomController {
    export function Run() {
        Room.Init();

        var rooms: RoomData[] = Room.GetList();
        //CLEAR CREEP MEMORY
        rooms.forEach((room) => {
            var controller = Game.rooms[room.name].controller;
            var controllerLevel = 0;
            if (controller != undefined) controllerLevel = controller.level;
            var creepData = BaseSettings[controllerLevel].Creeps;

            for (let x = 0; x < room.creeps.length; x++) {
                console.log(Game.creeps[room.creeps[x].name]);
                if (Game.creeps[room.creeps[x].name] == undefined) {
                    delete Memory.creeps[room.creeps[x].name];
                    Room.RemoveCreepAtPos(room.name, x);
                    continue;
                }
                //   console.log(Game.time - room.creeps[x].birth);
                if (Game.time - room.creeps[x].birth > 1200) {
                    console.log("Respawning creep");
                    // SpawnData.Add(room.creeps[x].role, room.name);
                    //RESPAWN
                }
                creepData[room.creeps[x].role]--;

                RoleController.Run(Game.creeps[room.creeps[x].name]);
            }

            Object.keys(creepData).forEach(function (key: any) {
                var value = creepData[key];
                if (value > 0) {
                    console.log("SPAWNING NEW CREEP");
                    // SPAWN NEW CREEP
                    var spawnCount = value;
                    var currentSpawning = SpawnData.CountRole(key, room.name);
                    console.log(currentSpawning);
                    spawnCount = spawnCount - currentSpawning;
                    if (spawnCount > 0) {
                        for (var x = 0; x < value; x++) {
                            console.log("Adding to SpawnList role:" + key + " room: " + room.name);
                            SpawnData.Add(key, room.name);
                        }
                    }
                }
            });

            //    console.log(JSON.stringify(creepData));
        });
    }
}
