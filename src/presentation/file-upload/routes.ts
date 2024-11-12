import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const uploadService  = new FileUploadService
    const uploadFile= new FileUploadController(uploadService);
 
     router.use([FileUploadMiddleware.contentFiles, TypeMiddleware.validTypes(['users', 'products', 'categories'])]);
     router.post('/single/:type', uploadFile.uploadFile);
     router.post('/multiple/:type', uploadFile.uploadMultipleFiles);



    return router;
  }


}