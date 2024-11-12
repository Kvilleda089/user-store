import { Request, Response } from "express";
import { CreateProdcutDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services";




export class ProductController {

    constructor(
        private readonly productoService: ProductService,
    ){}

         
    private handleError = (error: unknown, res: Response) => {
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message})
        }

        return res.status(500).json({error: 'Internal server Error'});
    }


    createProduct = (req: Request, res: Response) => {
        const [error, createProducto] = CreateProdcutDto.create({
            ...req.body,
            user: req.body.user.id
        });

        if(error) return res.status(400).json({error});
        this.productoService.createProduct(createProducto!)
                .then(product => res.json({product}))
                .catch(error => this.handleError(error, res))
        
    }

    getProducts = (req:Request, res: Response) => {
        const {page=1, limit = 10} = req.query;
        const [error, paginationDto ] = PaginationDto.create(+page, +limit);
       
        if(error) return res.status(400).json({error});

        this.productoService.getProducts(paginationDto!)
                .then(products => res.json(products))
                .catch(error => this.handleError(error, res))
    }

}