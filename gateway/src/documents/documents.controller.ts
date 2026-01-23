import { Controller, Post, Get, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards, Request } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post('upload')
  @UseGuards(JwtAuthGuard) // Protegemos la ruta, si no hay token, da error 401
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Validating max 5mb and pdf type
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'application/pdf' })
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req, // Inyectamos la petición (donde passport puso el user)
  ) {
    // req.user viene de lo que retornamos en jwt.strategy.ts (validate)
    const userId = req.user.userId;

    return this.documentsService.uploadFile(file, userId); // Usamos el servicio que sirve para separar la logica de acción del controlador para un clean code.
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }


}