// example declaration file - remove these and add your own custom typings

// memory extension samples

interface SpawnMemory {}

type CreepRole = "MINER" | "TRANSPORTER" | "WORKER" | "SCOUT";

interface CreepMemory {
    role: number;
}

interface RoomMemory {}

interface Memory {}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
