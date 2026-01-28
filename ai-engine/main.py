import os 
import asyncio 
import json
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
from redis import asyncio as aioredis

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger(__name__)

load_dotenv()

#Setup client Redis - Usign async version is used to avoid blocking the main fastapi thread
redis = aioredis.from_url(
    host = os.getenv("REDIS_URL"),
    decode_responses=True
)

# Fuction Consumer of messages | Funcion para consumir los mensajes de Redis
async def listen_to_redis():
    """
    Asynchronously listens to the 'upload_queue' in Redis using BLPOP with timeout=0 (blocking).

    Waits indefinitely for new messages in the queue. When a message arrives, it parses the data and logs the received information.
    If an error occurs during message retrieval or processing, it logs the error and retries after 5 seconds.

    Uses BLPOP with timeout=0 to block until a message is available, ensuring efficient resource usage for real-time processing.
    """

    logger.info("AI Worker started. LListen 'upload_queue' on Upstash")
    while True:
        try:
            message = await redis.blpop("upload_queue", timeout=0)

            if message:
                queue_name, data_str = message
                data = json.loads(data_str)
                logger.info(f"Data received from Nest: {data}")

                # AI Logic 

        except Exception as e:
            logger.error(f"Error reading Redis: {e}")
            await asyncio.sleep(5) # Pause 5 seg

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Services...")
    asyncio.create_task(listen_to_redis())
    yield
    logger.info("Closing conections..")
    await redis_close()

app = FastAPI(lifespan=lifespan)

@app.get("/")
def health_check():
    return {f"Status: AI worker active, service: Python + Upstash"}





