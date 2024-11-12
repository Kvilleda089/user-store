import { describe } from "node:test";
import { ProductModel } from "../../data";
import { CreateProdcutDto, CustomError, PaginationDto } from "../../domain";



export class ProductService {

    constructor(){}


    async createProduct(createProductDto: CreateProdcutDto){
        const productoExist = await ProductModel.findOne({ name: createProductDto.name});

        if(productoExist) throw CustomError.badRequest('Product alredy Exist');

        try {
            const product = new ProductModel(createProductDto);
            await product.save();

            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };


    async getProducts(paginationDto: PaginationDto) {
        const {page, limit} = paginationDto;

        try {
            const [total, products ] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page-1)* limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ]);

            
            return {
                page, 
                limit,
                total,
                products: products
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`); 
        }
    }
}