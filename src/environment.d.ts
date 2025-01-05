declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            BUS_USERNAME? : string;
            BUS_PASSWORD?: string;
            BUS_HOST?: string;
            BUS_COMMUNICATION_PORT?: string;
            BUS_NOTIFICATION_QUEUE?: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}