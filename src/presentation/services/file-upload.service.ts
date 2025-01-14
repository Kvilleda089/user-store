import path from "path";
import fs from 'fs';
import { UploadedFile } from "express-fileupload";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";


export class FileUploadService {

    constructor(
        private readonly uuid = Uuid.v4,
    ){}


    private checkFolder(folderPath: string){
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
    }

    public async uplodadSingle(file: UploadedFile, folder: string = 'uploads', validaExtensions: string[]=['jpg', 'png', 'jpeg', 'gif']) {

        try {
            const fileExtension = file.mimetype.split('/').at(1) ?? '';

            if(!validaExtensions.includes(fileExtension)){
                throw CustomError.badRequest(`Invalid extension ${fileExtension}`)
            }


            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);
            const fileName = `${this.uuid()}.${fileExtension}`;
            file.mv(`${destination}/${fileName}`)

            return {fileName};
        } catch (error) {
            console.log({error});
            throw error;
        }
    }


    public async uploadMultiple(files: UploadedFile[], folder: string = 'uploads', validaExtensions: string[]=['jpg', 'png', 'jpeg', 'gif']){

        const fileNames = await Promise.all(
            files.map(file => this.uplodadSingle(file, folder, validaExtensions))
        );

        return fileNames;
    }
}