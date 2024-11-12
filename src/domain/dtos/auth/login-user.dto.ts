import { regularExpes } from "../../../config";


export class LoginUserDto {

    constructor(
        public  readonly email: string, 
        public readonly password: string,
    ){}


    static loginUser(object: {[key: string]: any}): [string?, LoginUserDto?]{
        const {email, password} = object;
        
        if(!email) return ['Missing email'];
        if(!regularExpes.email.test(email)) return ['Email is not valid'];
        if(!password) return ['Missing password'];

        return [undefined, new LoginUserDto(email, password)]
    }
}