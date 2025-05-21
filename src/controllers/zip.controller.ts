import { Request, Response } from 'express';
import * as fs               from 'fs';
import JSZip                 from 'jszip';
import axios                 from "axios";

import { Rest }           from '../services/rest';
import { UploadProductI } from '../interfaces/upload-product.interface';
import firebaseStorage    from '../services/firebase/storage';

const imgExts = ["png", "jpeg", "jpg"];
const imgMbLimit = 5.00;
const BASE_URL = process.env.BASE_URL;

const upload = async(req: any | Request, res: Response)  => {
    try {
        let errs = [];
        let uploaded = 0;
        const file = req.files.file;
        const zip = new JSZip();

        const bytes = fs.readFileSync(file.path);
        
        await zip.loadAsync( bytes )
            .then( async (zip) => {
                const arrFiles = Object.values(zip.files);

                for await(let file of arrFiles) {
                    const filename = file.name;
                    const ext      = filename.substr( filename.lastIndexOf('.') + 1 ).toLocaleLowerCase();
                    const sku      = filename.substr( 0, filename.lastIndexOf('.') ).toLocaleLowerCase();
                    const validExt = imgExts.find(imgExt => imgExt === ext);

                    if( !validExt ) {
                        errs.push(`The file ${ filename } has a invalid format`);
                        continue;
                    }
                    
                    // validate file size
                    const size = await file.async('nodebuffer')
                        .then((bytes) => {
                            const fileMb = parseFloat((bytes.byteLength / (1024 * 1024)).toFixed(2));
                            if( fileMb > imgMbLimit ) return {error : `The file ${file.name} has a size higher than permitted`};
                            
                            return { data: bytes};
                        }).catch((e) => {
                            return {error: e};
                        });
                    
                    if( size['error'] ) {
                        errs.push(size['error']);
                        continue;
                    }

                    const serverImg = `/tmp/${ filename }`;

                    fs.createWriteStream(serverImg).write(size['data']);

                    const folder_path = `/files/products/app_${req.user.app_id}/images`;

                    const url = await firebaseStorage.save_file(filename, folder_path, serverImg);
                    
                    if( !url ) {
                        errs.push(`Error uploading file ${ filename } to cloud`);
                        continue;
                    }                    

                    const data: UploadProductI = {
                        app_id : req.user.app_id,
                        sku,
                        url_image: url,
                    }                    
                    
                    const result = await updateUrlProduct(req, '/api/spatial/products/update/image', data);

                    if( !result ) {
                        errs.push(`The product with sku ${sku } was not updated`);
                        continue;
                    }

                    uploaded += 1;
                    
                }

            }).catch(e => {
                console.log(`Zip upload error: ${e}`);
                errs.push(e.message);
            });
        
        if(errs.length > 0)
            return Rest.response({res, status_http: 400, message: `${ uploaded } files uploaded and this errors: ${ errs.toString() }` });

        return Rest.response({res, message:  `${ uploaded } files uploaded`});

    } catch(e) {
        console.log(`Zip upload error: ${e}`);
        return Rest.response({res, status_http: 400, message: 'Unexpected error'});
        
    }
}

const updateUrlProduct = async (req: any | Request, url: string, data: UploadProductI) => {
    const response = await axios({
        url    : `${ BASE_URL }${ url }`,
        method : 'POST',
        headers: {
            'Authorization' : `Bearer ${req.user.access_token}`,
        },
        data,
    })
        .then(data => {
            return data.data;
        })
        .catch(err => {
            console.log(`Zip updateUrlProduct error: ${err}`);
            return null;
        });
    return response;
}

export {
    upload,
}
