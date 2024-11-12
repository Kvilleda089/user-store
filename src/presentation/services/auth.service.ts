import { BcryptAdaptar, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    constructor(
        private readonly emailService: EmailService,
    ) { }


    public async registerUser(registerDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerDto.email });

        if (existUser) throw CustomError.badRequest('Email read exist');

        try {

            const user = new UserModel(registerDto);

            user.password = BcryptAdaptar.hash(registerDto.password);
            user.save();
            this.sendEmailValidate(registerDto.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);
            const token = await JwtAdapter.generateToken({id: user.id});

            if(!token) throw CustomError.internalServer('Error token');
            return {
                user: userEntity,
                token: token,
            };



        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {


        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Email  not exist');

        try {

            const isMatching = BcryptAdaptar.compare(loginUserDto.password, user.password!)
            if( !isMatching ) throw CustomError.badRequest('Credentials is incorrect');

            const {password, ...userEntity}= UserEntity.fromObject(user);
            const token = await JwtAdapter.generateToken({id: user.id});

            if(!token) throw CustomError.internalServer('Error token');

            return {
                user:userEntity,
                token: token
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    private sendEmailValidate = async (email: string) =>{
        
        const token = await JwtAdapter.generateToken({email});
        if(!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email </p>
        <a href="${link}">Validate your email: ${email}</a>
        `;

        const options = {
            to: email, 
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSet = await this.emailService.sendEmail(options);

        if(!isSet) throw CustomError.internalServer('Error sending email');

        return true;
    }

    public validateEmail = async (token: string) =>{
        const payload = await JwtAdapter.validateToken(token);

        if(!payload) throw CustomError.badRequest('Invalid Token');

        const {email} = payload as {email: string};

        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.internalServer('Email not exist');

        user.emailValidate = true;

        await user.save();

        return true;
    }
}