// example declaration file - remove these and add your own custom typings

// memory extension samples

interface SpawnMemory {
    currentCreeps: number;
}

interface CreepMemory {
    role: string;
    room?: string;
    working?: boolean;
    attackTarget?: any;
    energyUsed?: number;
    target?: AnyStructure | null;
    inNewRoomCount?: number;
    currentMineID?: number;
    isTransporting?: boolean;
    transportedEngergy?: number;
    nextRoom?: string;
    spawn: StructureSpawn;
}
interface RoomMemory {
    mineID: number;
}

interface Memory {
    uuid: number;
    log: any;
    scoutData: any;
    insufficentFarmRoute: any;
    sufficentFarmRoute: any;
    rangeFarmRange: number;
    rangeFarmData: any;
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
