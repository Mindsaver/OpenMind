import { RoleController } from "controller/role";
import { Room, RoomData } from "data/room";
import { SpawnData } from "data/spawn";
import { BaseSettings } from "config/base";

export module RoomController {
    export function Run() {
        Room.Init();

        var rooms: RoomData[] = Room.GetList();
        //CLEAR CREEP MEMORY
        rooms.forEach((room) => {
            var controller = Game.rooms[room.name].controller;
            var controllerLevel = 0;
            if (controller != undefined) controllerLevel = controller.level;
            var creepData = Object.assign({}, BaseSettings[controllerLevel].Creeps);
            for (let x = 0; x < room.creeps.length; x++) {
                //   console.log(Game.creeps[room.creeps[x].name]);
                if (Game.creeps[room.creeps[x].name] == undefined) {
                    delete Memory.creeps[room.creeps[x].name];
                    Room.RemoveCreepAtPos(room.name, x);
                } else {
                    if (Game.time - room.creeps[x].birth > 1200) {
                        console.log("Respawning creep");
                        // SpawnData.Add(room.creeps[x].role, room.name);
                        //RESPAWN
                    }
                    creepData[room.creeps[x].role]--;
                    RoleController.Run(Game.creeps[room.creeps[x].name]);
                }
            }
            console.log(JSON.stringify(creepData));
            Object.keys(creepData).forEach(function (key: any) {
                var value = creepData[key];
                console.log("VALUE:" + value);
                if (value > 0) {
                    console.log("SPAWNING NEW CREEP");
                    // SPAWN NEW CREEP
                    var spawnCount = value;
                    var currentSpawning = SpawnData.CountRole(key, room.name);
                    console.log(currentSpawning);
                    spawnCount = spawnCount - currentSpawning;
                    if (spawnCount > 0) {
                        for (var x = 1; x < value; x++) {
                            console.log("Adding to SpawnList role:" + key + " room: " + room.name);
                            SpawnData.Add(key, room.name);
                        }
                    }
                }
            });
        });
    }
}
