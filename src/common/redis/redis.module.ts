import { Global, Module } from "@nestjs/common";
import { createClient } from "redis";



// @Global()
@Module({
    imports: [],
    controllers: [],
    providers: [

        {
            provide: "REDIS_CLIENT", // unique
            useFactory: async () => {
                const redis = await createClient({
                    url: process.env.REDIS_URL
                })
                console.log("redis connect done")
                await redis.connect()
                redis.on('error', (err) => {
                    console.log("redis connected error", err)
                })
                return redis
            }
        }
    ],
    exports: ["REDIS_CLIENT"]
})
export class RedisModule { }