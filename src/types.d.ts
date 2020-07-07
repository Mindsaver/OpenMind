// example declaration file - remove these and add your own custom typings

// memory extension samples

interface SpawnMemory {}

type CreepRole = "MINER" | "TRANSPORTER" | "WORKER" | "SCOUT";

interface CreepMemory {
    role: number;
}

interface RoomMemory {}

interface Memory {
    Controller: any;
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}

interface RoomData {
    Sources: object;
}
