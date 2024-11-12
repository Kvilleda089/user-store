import { Router } from "express";
import { ImagesController } from "./controller";


export class ImagesRoutes {


    static get routes(): Router {
  
      const router = Router();
      const imagesController = new ImagesController();
       router.get('/:type/:img', imagesController.getImage);
  
      return router;
    }
  
  
  }