import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>, //Repository allows to make SQL queries - Repository de typeor permite hacer las queries de SQL facilmente.
    private configService: ConfigService,
  ) {

    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') ?? '',
      this.configService.get<string>('SUPABASE_KEY') ?? '',
    );
  }

  // Methods

  // Se usa Multer como Middleware que facilita: recibir, procesar, almacenar archivos (pdfs, etc.) manejando la carga multipart/form-data.
  async uploadFile(file: Express.Multer.File, userId: string) {
    try {

      // Create a unique name to avoid rewrite- Crear un nombre único para el archivo (para evitar sobreescribir) Ej: 1723123123-manual.pdf 
      const fileName = `${Date.now()}-${file.originalname}`;

      // Upload to Supabase - Subida a Supabasep
      const { data, error } = await this.supabase.storage
        .from('pdfs') // Bucket name - Storage
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new Error(`Error uploading to Supabase: ${error.message}`)
      }

      // Obtain public url of file and save it into database - Obtener url publica y guardala dentro de la base de datos.
      const filePath = data.path

      // Save metadata in the database (PostgreSQL) -- Guardar metadata en la base de datos.
      const newDoc = this.documentRepository.create({
        content: file.originalname, // Original name
        filePath: filePath, // Bucket rout  e - Ruta en el bucket del storage
        ownerId: userId,
        metadata: { size: file.size, type: file.mimetype }
      });

      return await this.documentRepository.save(newDoc); // Save - Guardar 
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('The file could not be processed')
    }
  }

  findAll(): Promise<Document[]> {
    return this.documentRepository.find()
  }

}

