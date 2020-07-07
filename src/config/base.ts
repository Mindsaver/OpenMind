export const BaseSettings = {
    RoadPos: [
        { x: -6, y: 1 },
        { x: -6, y: 3 },
        { x: 6, y: 1 },
        { x: 6, y: 3 }
    ],

    1: {
        Buildings: {
            Creeps: {
                // "MINER" | "TRANSPORTER" | "WORKER" | "SCOUT";
                2: 3 // WORKER
            }
        }
    },
    2: {
        Creeps: {
            // "MINER" | "TRANSPORTER" | "WORKER" | "SCOUT";
            2: 3, // WORKER
            0: 2, // MINER
            1: 2 // TRANSPORTER
        },
        Buildings: {
            Extensions: [
                { x: -1, y: -1 },
                { x: -2, y: 0 },
                { x: -1, y: 2 },
                { x: -2, y: -2 },
                { x: -3, y: -1 }
            ],
            Roads: [
                { x: 0, y: -1 },
                { x: -1, y: 0 },
                { x: -2, y: -1 },
                { x: -3, y: -2 },
                { x: 1, y: 0 }
            ]
        }
    },
    3: {
        Creeps: {
            // "MINER" | "TRANSPORTER" | "WORKER" | "SCOUT";
            2: 4,
            0: 2,
            1: 4
        },
        Buildings: {
            Extensions: [
                { x: -3, y: 0 },
                { x: -4, y: -1 },
                { x: -4, y: -2 },
                { x: -3, y: -3 },
                { x: -2, y: -3 }
            ],
            Towers: [{ x: 0, y: 2 }],
            Roads: [
                { x: -2, y: 1 },
                { x: -1, y: 2 },
                { x: 0, y: 3 },
                { x: 1, y: 2 },
                { x: 2, y: 1 }
            ],
            Container: [{ x: 0, y: 1 }]
        }
    },
    4: {
        Creeps: {
            // "MINER" | "TRANSPORTER" | "WORKER" | "SCOUT";
            2: 4,
            0: 2,
            1: 4
        },
        Buildings: {
            Extensions: [
                { x: 1, y: -1 },
                { x: 1, y: -2 },
                { x: 2, y: -2 },
                { x: 2, y: -3 },
                { x: 3, y: -3 },
                { x: 4, y: -2 },
                { x: 4, y: -1 },
                { x: 3, y: -1 },
                { x: 3, y: 0 },
                { x: 2, y: 0 }
            ],
            Roads: [
                { x: -5, y: -2 },
                { x: -4, y: -3 },
                { x: -3, y: -4 },
                { x: 2, y: -1 },
                { x: 3, y: -2 },
                { x: 4, y: -3 },
                { x: 3, y: -4 },
                { x: 5, y: -2 },
                { x: 3, y: 1 },
                { x: 4, y: 1 },
                { x: 5, y: 1 },
                { x: 6, y: 1 },
                { x: 6, y: 2 },
                { x: 6, y: 3 },
                { x: 5, y: 3 },
                { x: 4, y: 3 },
                { x: 3, y: 3 },
                { x: 2, y: 3 },
                { x: 1, y: 3 },
                { x: -1, y: 3 },
                { x: -2, y: 3 },
                { x: -3, y: 3 },
                { x: -4, y: 3 },
                { x: -5, y: 3 },
                { x: -6, y: 3 },
                { x: -6, y: 2 },
                { x: -6, y: 1 },
                { x: -5, y: 1 },
                { x: -4, y: 1 },
                { x: -3, y: 1 }
            ],
            Storage: [{ x: 0, y: 4 }]
        }
    },
    5: {
        Creeps: {
            // "MINER" | "TRANSPORTER" | "WORKER" | "SCOUT";
            2: 4,
            0: 2,
            1: 4
        },
        Buildings: {
            Extensions: [
                { x: -5, y: -1 },
                { x: -6, y: -1 },
                { x: -6, y: -2 },
                { x: -6, y: -3 },
                { x: -4, y: -3 },
                { x: -4, y: -4 },
                { x: -3, y: -4 },
                { x: -3, y: -5 },
                { x: -2, y: -1 },
                { x: -1, y: -1 }
            ],
            Towers: [{ x: 1, y: 3 }]
        }
    }
};
