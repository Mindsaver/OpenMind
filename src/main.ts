import { ErrorMapper } from "utils/ErrorMapper";
import { SpawnController } from "controller/spawn";
import { RoomController } from "controller/room";

export const loop = ErrorMapper.wrapLoop(() => {
    // Automatically delete memory of missing creeps
    /*for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }*/
    SpawnController.Run();
    RoomController.Run();

    /*  var sources: Source[] = Game.spawns.Spawn1.room.find(FIND_SOURCES);
    let goals = _.map(Game.spawns.Spawn1.room.find(FIND_SOURCES), function (source) {
        // We can't actually walk on sources-- set `range` to 1
        // so we path next to it.
        return { pos: source.pos, range: 1 };
    });
    var pos = Game.spawns.Spawn1.pos;
    pos.x = pos.x + 6;
    pos.y = pos.y + 1;
    goals.forEach((goal) => {
        //  Game.creeps.BLABLA.moveTo(sources[1]);

        var t = PathFinder.search(pos, goal);
        t.path.forEach((path) => {
            Game.spawns.Spawn1.room.visual.circle(path.x, path.y);
        });
    });*/

    /*var roomData: RoomData = {
        Sources:
    };
    ControllerRoom.RoomController.Add(Game.spawns.Spawn1.room.name,roomData);

    ControllerSpawn.Spawn(Game.spawns.Spawn1);*/
});
