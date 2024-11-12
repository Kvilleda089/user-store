import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryService } from '../services';




export class CategoryRoutes {


  static get routes(): Router {

    const router = Router();
    const categoryService = new CategoryService();
    const cateogryController = new CategoryController(categoryService);
    // Definir las rutas
     router.get('/', cateogryController.getCategories);
     router.post('/', [AuthMiddleware.validateJwt], cateogryController.createCategory);



    return router;
  }


}