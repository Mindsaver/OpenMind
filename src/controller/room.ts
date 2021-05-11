import { RoleController } from "controller/role";
import { Room, RoomData } from "data/room";
import { SpawnData } from "data/spawn";
import { BaseSettings } from "config/base";
import { BaseRole } from "role/base";
import { Worker } from "role/worker";

export module RoomController {
    export async function Run() {
        if (Room.Init()) {
            return;
        }

        var rooms: RoomData[] = Room.GetList();
        //CLEAR CREEP MEMORY
        rooms.forEach(async (room) => {
            var controller = Game.rooms[room.name].controller;
            var controllerLevel = 0;
            if (controller != undefined) controllerLevel = controller.level;
            var creepData = Object.assign({}, BaseSettings[controllerLevel].Creeps);
            for (let x = 0; x < room.creeps.length; x++) {
                let creep: Creep = Game.creeps[room.creeps[x]];
                if (creep == undefined) {
                    console.log("Deleting Memory of removed Creep");
                    delete Memory.creeps[room.creeps[x]];
                    Room.RemoveCreepAtPos(room.name, x);
                    x--;
                }
            }

            // ITERATE ALL CREEPS IN THE ROOM TO GET THE CURRENT AMMOUNT OF CREEPS
            //   const creepCount = room.creeps.length;
            for (let x = 0; x < room.creeps.length; x++) {
                let creep: Creep = Game.creeps[room.creeps[x]];
                //   console.log(creep);

                if (creep != undefined) {
                    let creepClass = RoleController.GetCreepClass(creep);
                    if (creepClass != null) {
                        creepClass.Tick();

                        if (creep.ticksToLive != undefined && creep.ticksToLive == 100) {
                            console.log("Respawning creep because tickToLive < 100");
                            SpawnData.Add(creepClass.role, room.name);
                            //RESPAWN
                        }
                        creepData[creepClass.role]--;
                    }
                }
            }
            //https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop

            for (let x = 0; x < Object.keys(creepData).length; x++) {
                let key: any = Object.keys(creepData)[x];
                var value = creepData[key];
                if (value > 0) {
                    // SPAWN NEW CREEP
                    var spawnCount = value;
                    var currentSpawning = SpawnData.CountRole(key, room.name);
                    spawnCount = spawnCount - currentSpawning;
                    if (spawnCount > 0) {
                        for (var y = 0; y < value; y++) {
                            console.log("Adding to SpawnList role:" + key + " room: " + room.name);
                            SpawnData.Add(key, room.name);
                        }
                    }
                }
            }
            console.log("-----------------------------");
        });
    }
}
