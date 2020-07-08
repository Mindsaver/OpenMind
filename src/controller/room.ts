import { RoleController } from "controller/role";
import { Room, RoomData } from "data/room";
import { SpawnData } from "data/spawn";
import { BaseSettings } from "config/base";
import { BaseRole } from "role/base";
import { Worker } from "role/worker";

export module RoomController {
    export function Run() {
        if (Room.Init()) {
            return;
        }

        var rooms: RoomData[] = Room.GetList();
        //CLEAR CREEP MEMORY
        rooms.forEach((room) => {
            var controller = Game.rooms[room.name].controller;
            var controllerLevel = 0;
            if (controller != undefined) controllerLevel = controller.level;
            var creepData = Object.assign({}, BaseSettings[controllerLevel].Creeps);
            console.log(JSON.stringify(creepData));
            // ITERATE ALL CREEPS IN THE ROOM

            for (let x = 0; x < room.creeps.length; x++) {
                //   console.log(Game.creeps[room.creeps[x].name]);
                let creep: Creep = Game.creeps[room.creeps[x]];
                console.log(creep);

                if (creep == undefined) {
                    delete Memory.creeps[room.creeps[x]];
                    Room.RemoveCreepAtPos(room.name, x);
                } else {
                    let creepClass = RoleController.GetCreepClass(creep);
                    if (creepClass != null) {
                        creepClass.Tick();

                        if (creep.ticksToLive != undefined && creep.ticksToLive == 100) {
                            console.log("Respawning creep");
                            SpawnData.Add(creepClass.role, room.name);
                            //RESPAWN
                        }

                        creepData[creepClass.role]--;
                    }
                    //RoleController.Run(Game.creeps[room.creeps[x].name]);
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
                    console.log("currentSpawning" + currentSpawning);
                    console.log("SPAWNCOUNT BEFORE:" + spawnCount);
                    spawnCount = spawnCount - currentSpawning;
                    console.log("SPAWNCOUNT AFTER:" + spawnCount);
                    if (spawnCount > 0) {
                        for (var x = 0; x < value; x++) {
                            console.log("Adding to SpawnList role:" + key + " room: " + room.name);
                            SpawnData.Add(key, room.name);
                        }
                    }
                }
            });
            console.log("-----------------------------");
        });
    }
}
