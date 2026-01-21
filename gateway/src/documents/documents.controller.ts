import { Controller, Post, Get, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService){}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Validating max 5mb and pdf type
          new MaxFileSizeValidator({maxSize: 1024 * 1024 * 5}),
          new FileTypeValidator({ fileType: 'application/pdf' })
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.documentsService.uploadFile(file); // Usamos el servicio que sirve para separar la logica de acción del controlador para un clean code.
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }







}