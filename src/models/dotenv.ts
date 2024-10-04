declare module 'process' {
    global {
        // eslint-disable-next-line @typescript-eslint/no-namespace
        namespace NodeJS {
            interface ProcessEnv {
                REDIS_URL: string;
            }
        }
    }
}
