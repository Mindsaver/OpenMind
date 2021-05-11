import { BaseSettings } from "config/base";
export interface Outpost {
    name: string;
    ressources: Ressource[];
}

export interface Ressource {
    pos: RoomPosition;
    cost: number;
    type: string;
}

export interface Building {
    pos: RoomPosition;
    type: string;
}
export interface CreepData {
    name: string;
    birth: number;
    role: CreepRole;
}

export interface RoomData {
    name: string;
    creeps: string[];
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
            return true;
        }
        return false;
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

    export function AddCreep(room: string, creepName: string) {
        if (Memory.Controller.Rooms[room] == undefined) return;
        Memory.Controller.Rooms[room].creeps.push(creepName);
    }
    export function RemoveCreepAtPos(room: string, position: number) {
        if (Memory.Controller.Rooms[room] == undefined) return;
        if (position > -1) {
            Memory.Controller.Rooms[room].creeps.splice(position, 1);
        }
    }
    export function ListCreepsInRoom(room: string) {
        return Memory.Controller.Rooms[room].creeps;
    }

    export function GetList(): RoomData[] {
        return _.map(Memory.Controller.Rooms);
    }
}
