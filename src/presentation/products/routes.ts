import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controllers';
import { ProductService } from '../services';




export class ProductRoutes {


  static get routes(): Router {

    const router = Router();
    const productService = new ProductService();
    const productController= new ProductController(productService);
 
     router.get('/', productController.getProducts);
     router.post('/', [AuthMiddleware.validateJwt], productController.createProduct);



    return router;
  }


}