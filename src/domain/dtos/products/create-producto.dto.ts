import { Validators } from "../../../config";



export class CreateProdcutDto {


    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string,
    ){}


    static create(object: { [key: string]: any}): [string?, CreateProdcutDto?] {
        const {name, available, price, description, user, category} = object;

        if(!name) return ['Missing name'];

        if(!user) return ['Missing user'];
        if(!Validators.isMongoId(user)) return ['Invalidad User Id']

        if(!category) return ['Missing category'];
        if(!Validators.isMongoId(category)) return ['Invalidad category id']

        return [undefined, new CreateProdcutDto(name, !!available, price, description, user, category)];
    }
};