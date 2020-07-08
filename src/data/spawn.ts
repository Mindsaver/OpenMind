import { BaseSettings } from "config/base";
import { CreepRole } from "role/base";

export module SpawnData {
    export function Init() {
        if (Memory.Controller == null) {
            Memory.Controller = {};
        }
        if (Memory.Controller.Spawn == null) {
            Memory.Controller.Spawn = [];
            console.log("Init SpawnController");
            return true;
        }
        return false;
    }
    export function Add(role: CreepRole, room: string) {
        Memory.Controller.Spawn.push({ role: role, room: room });
        Memory.Controller.Spawn = Memory.Controller.Spawn.sort((a: any, b: any) => {
            if (BaseSettings.RoleOrder[a.role] < BaseSettings.RoleOrder[b.role]) {
                return -1;
            }
            if (BaseSettings.RoleOrder[a.role] > BaseSettings.RoleOrder[b.role]) {
                return 1;
            }
            return 0;
        });
    }
    export function CountRole(role: CreepRole, room: string) {
        var roles = Memory.Controller.Spawn.filter((x: any) => x.role == role && x.room == room);
        console.log("room:" + room + " role:" + role + " count:" + roles.length);
        return roles.length;
    }
    export function GetList(room: string) {
        return Memory.Controller.Spawn.filter((x: any) => x.room == room);
    }
    export function RemoveAtPosition(position: number) {
        console.log("POSITION" + position);
        if (position > -1) {
            Memory.Controller.Spawn.splice(position, 1);
        }
    }
}
