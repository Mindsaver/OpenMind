import { Init } from "./road";
import { BaseSettings } from "config/base";
import { CreepRole } from "role/base";
var baseSetting: any = _.map(BaseSettings);
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
            Room.Add(Game.spawns.Spawn1.room.name);
        }
        console.log("test");
    }
    export function Add(room: string) {
        //FIXME ADD ME LATER
        if (Memory.Controller.Rooms[room] != undefined) return;
        var spawns: StructureSpawn[] = _.map(Game.rooms[room].find(FIND_MY_SPAWNS));
        let sources: Source[] = _.map(spawns[0].room.find(FIND_SOURCES));
        console.log(JSON.stringify(sources));
        let minerals: Mineral[] = _.map(spawns[0].room.find(FIND_MINERALS));

        let basePositions: RoomPosition[] = [];
        BaseSettings.RoadPos.forEach((pos) => {
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

    export function AddCreep(room: string, creep: string) {
        if (Memory.Controller.Rooms[room] == undefined) return;
    }
    export function RemoveCreep(room: string, creep: string) {
        if (Memory.Controller.Rooms[room] == undefined) return;
    }
}

export module RoomController {
    export function Run() {
        Room.Init();
        var rooms: RoomData[] = _.map(Memory.Controller.Rooms);

        //CLEAR CREEP MEMORY
        rooms.forEach((room) => {
            var controllerLevel = Game.rooms[room.name].controller?.level;
            if (controllerLevel == undefined) controllerLevel = 0;

            var creepData = baseSetting[controllerLevel].Creeps;

            for (let x = 0; x < room.creeps.length; x++) {
                if (!Game.creeps[room.creeps[x].name]) {
                    delete Memory.creeps[room.creeps[x].name];
                    Room.RemoveCreep(room.name, room.creeps[x].name);
                }
                if (Game.time - room.creeps[x].birth > 1200) {
                    //RESPAWN
                }

                creepData[room.creeps[x].role]--;
            }

            var creepD = _.map(creepData);
            creepD.forEach((value: any, index) => {
                if (value > 0) {
                    console.log("Spawning ROLE:" + index + " COUNT:" + value);
                }
            });

            //    console.log(JSON.stringify(creepData));
        });
    }
}
