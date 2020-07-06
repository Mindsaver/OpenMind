import { ErrorMapper } from "utils/ErrorMapper";
import * as ControllerSpawn from "controller/spawn";

export const loop = ErrorMapper.wrapLoop(() => {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    ControllerSpawn.Spawn(Game.spawns.Spawn1);
});
