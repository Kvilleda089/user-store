import { CustomError } from "../errors/custom.error";


export class UserEntity {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly emailValidate: boolean,
        public readonly password: string, 
        public readonly role: string[],
        public readonly img?: string,

    ){}

    static fromObject(object: {[key: string]:any}){
        const {id, _id, name, email, emailValidate, password, role, img} = object;

        if(!_id && id){
            throw CustomError.badRequest('Missing id');
        };

        if(!name) throw CustomError.badRequest('Missing name');
        if(!email) throw CustomError.badRequest('Missing email');
        if(emailValidate === undefined) throw CustomError.badRequest('Missing emailValidate');
        if(!password) throw CustomError.badRequest('Missing passord')

            return new UserEntity(_id || id, name, email, emailValidate, password, role, img);
    }
}