import { Injectable, Inject, OnModuleDestroy, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';


@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name)

    constructor(
        // We inject the client that was configured in the module
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ) { }

    // Cerramos conexión con Redis | Close conection with Redis using the lifecycle hook.
    onModuleDestroy() {
        this.redisClient.disconnect();
    }

    /**
   
   * @param queueName El nombre de la lista en Redis (ej: "rag_processing_queue")
   * @param payload Los datos que Python necesita (ID del documento, path, etc)
   */
    async addJobToQueue(queueName: string, payload: any): Promise<void> {
        try {
            // Objeto a sting | Object to string cause Redis only save text.
            const dataString = JSON.stringify(payload);

            //LPUSH: Insert to the start of list (Left Push) | Inserta al inicio de la lista.
            await this.redisClient.lpush(queueName, dataString);

            this.logger.log(`Job added to queue ${queueName}: DOC ID ${payload.documentId}`);
        } catch (error) {
            this.logger.error(`Error adding job to Redis: ${error.message}`)
            throw error;
        }
    }

    // Health check (Utility to check conextion) | Metodo para verificar conexión
    async ping(): Promise<string> {
        return await this.redisClient.ping();
    }


}
