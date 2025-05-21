import { Request, Response } from 'express';
import ExcelService from '../services/excel.service';
// services
import { Rest }       from '../services/rest';
import ProductsSvc    from '../services/products.service';
import InventoriesSvc from '../services/inventories.service';
import usersService from '../services/users.service';

const headers  = [ 'product_sku', 'code_shop', 'price', 'discount', 'quantity' ];
const errs     = [];

const upload = async (req: any | Request, res: Response) => {
    const result = await ExcelService.readFile(req.files.file);
    const dataloaded = await loadData(result, req);

    if( dataloaded.err && dataloaded.data) return Rest.response({res, status_http: 400, message: dataloaded.msg, status_code: dataloaded.err, data: dataloaded.data}); 
    
    if( dataloaded.err )return Rest.response({res, status_http: 400, message: dataloaded.msg, status_code: dataloaded.err});

    if(errs.length > 0) return Rest.response({res, status_http: 400, message: 'Some errors finded', data: errs });
    
    return Rest.response({res, message: 'All data has been loaded succesfull'});
}

const loadData = async ({results, header, meta}, req) => {
    let headersOk = 0;
    
    for(let h of header) {
        const head = headers.find(he => he === h);
        if(head) headersOk += 1;
    }
    
    if( headersOk < headers.length ) return { err: 100, msg : `Enter valid headers: ${headers.toString()}` }
    
    let data = [];

    const productsSvc = new ProductsSvc();
    const products    = await productsSvc.getAllProducts();
    
    for(let result of results) {
        const product = products.find(product => product.sku == result.product_sku);

        if( !product ) {
            errs.unshift(`The product ${result.product_sku} does not exist`);
            continue;
        }

        if( !product.image ) {
            errs.unshift(`The product ${result.product_sku} does not have an image`);
            continue;
        }

        if( result.quantity == 0 ) {
            errs.unshift(`The product ${result.product_sku} does not have a quantity`);
            continue;
        }

        const payload = {
            discount    : result.discount,
            price       : result.price,
            product_sku : product.sku,
            quantity    : result.quantity,
            code_shop     : result.code_shop,
        }

        data.push(payload);
    }
    
    const resUploaded = await divideArr(data, 8, req);

    if( resUploaded.err ) return { err: resUploaded.err, msg: 'Errors uploading data', data: resUploaded.msg };

    return {err: null, msg: 'ok'};
    
}

const divideArr = async (data=[], parts=8, req) => {
    let temp = [], to_excel = [], ok = 0;

    while(data.length > 0) temp.push(data.splice(0, parts));

    const inventoriesSvc = new InventoriesSvc();

    for(let arr of temp) {
        const res = await inventoriesSvc.createWithJSON(arr);
        
        if( !res ) {
            errs.unshift(`the products from SKU ${ arr[0].product_sku } to ${ arr[arr.length - 1].product_sku } could not able uploaded`);

            const objs = arr.map(a => a);

            to_excel.push(objs);

            continue;
        }

        ok += arr.length;

    }
    let merged = [].concat.apply([], to_excel);
    
    if( merged.length > 0) return { err: 101, msg: merged}
    
    return { err: null, msg: 'All rows are being updated'};

}


const getAll = async (req: any | Request, res: Response) => {
    const users = [];
    usersService.getAll().then(data => {
        data.forEach(user => {
            users.push({
                id: user.id,
            });
        });
        return Rest.response({res, data: users});
    });

}

export {
    upload,
    getAll,
}
