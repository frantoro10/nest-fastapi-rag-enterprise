import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  private supabase: SupabaseClient;
  private readonly QUEUE_NAME = 'rag_processing_queue';
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>, //Repository allows to make SQL queries - Repository de typeor permite hacer las queries de SQL facilmente.
    private configService: ConfigService,
    private readonly redisService: RedisService,
    ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') ?? '',
      this.configService.get<string>('SUPABASE_KEY') ?? '',
    );
  }

  /** 
    Handles the complete file upload flow for the RAG system.
    Workflow:
      1. Uploads the raw PDF to Supabase Storage.
      2. Persists metadata in PostgreSQL to generate a valid Document ID.
      3. Dispatches a job to Redis so the Python microservice can start vectorization.
   */
  async uploadFile(file: Express.Multer.File, userId: string) {
    try {
      // Generate a unique filename using a timestamp to prevent overwriting existing files
      const fileName = `${Date.now()}-${file.originalname}`;

      // 1. Upload the physical file to object storage (Supabase)
      const { data, error } = await this.supabase.storage
        .from('pdfs')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      // 2. Persist metadata in the relational database (PostgreSQL)
      // We need to save it first to obtain the generated 'id' required for the processing job.
      const filePath = data.path;

      const newDoc = this.documentRepository.create({
        content: file.originalname,
        filePath: filePath,
        ownerId: userId,
        metadata: { size: file.size, type: file.mimetype }
      });

      const savedDoc = await this.documentRepository.save(newDoc);

      // 3. Dispatch asynchronous job to the Redis Queue
      // We construct a lightweight payload with only the necessary references for the Python consumer.
      const payload = {
        documentId: savedDoc.id,   
        filePath: savedDoc.filePath, 
        userId: userId            
      };

      await this.redisService.addJobToQueue(this.QUEUE_NAME, payload);
      
      this.logger.log(`Document ${savedDoc.id} queued for processing.`);

      // 4. Return immediate feedback to the client
      // The user is notified that the upload was successful, even though processing continues in the background.
      return {
        message: 'File uploaded successfully. AI processing started.',
        document: savedDoc
      };

    } catch (error) {
      this.logger.error(`Upload flow failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('The file could not be processed');
    }
  }

  findAll(): Promise<Document[]> {
    return this.documentRepository.find()
  }

}

