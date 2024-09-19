import { diskStorage } from "multer";
const  { v4 : uuidv4 } = require('uuid');
import fs = require('fs');

import path = require ('path')

const validMimeType = [ 'image/png' , 'image/jpg' , 'image/jpeg'];

export const saveImagesToStorage = (destination) => {
    return {
        storage: diskStorage({
            destination: `./uploads/${destination}`,
            filename: (req, file, cb)=>{ 
                //request, file, callback
                const fileExtension: string = path.extname(file.originalname);
                const filename: string = uuidv4() + fileExtension;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimeTypes = validMimeType
            allowedMimeTypes.includes(file.mymetype)
            ? cb(null, true)
            : cb(null, false)
        }
    }
}

export const removeFile = (fullFilePath: string) =>{
    try {
        fs.unlinkSync(fullFilePath)
    } catch (e) {
        console.error(new Date(), e)
    }
}