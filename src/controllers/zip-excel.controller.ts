import { Request, Response } from "express";
import * as fs               from 'fs';
import path                  from "path";
import JSZip                 from 'jszip';
// services
import {Rest}     from "../services/rest";
import ShopService  from "../services/shops.service";
import ExcelService from '../services/excel.service';
import ProductsService from "../services/products.service";
import InventoriesService from "../services/inventories.service";
// data
import products_cats from '../../data/products-cat.json';

const excelMbLimit = 1.00;

const upload = async (req: any | Request, res: Response) => {
    const ShopSvc = new ShopService();
    const shops  = await ShopSvc.getShops();

    const shopsFiltered = shops.filter(shop => shop.status === 1 );
    
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth() + 1;
    const day   = now.getDate();

    const monthStr = month < 10 ? `0${month}` : month;
    const dayStr   = day < 10 ? `0${day}` : day;

    const date = `${year}${monthStr}${dayStr}`;    
    
    try{
        const file   = req.files.file;
        const zip    = new JSZip();
        const bytes  = fs.readFileSync(file.path);

        let errs = [], uploaded = 0, no_loaded = [];

        await zip.loadAsync( bytes ).then( async (zip) => {
            const arrFiles = Object.values(zip.files);

            for await(let file of arrFiles) {
                const filename = file.name;
                const ext      = filename.substr( filename.lastIndexOf('.') + 1 ).toLocaleLowerCase();
                
                const filenameSplit = filename.split('_');
                const shopCode      = filenameSplit[4].substr(0, filenameSplit[4].indexOf('.'));

                // if(filenameSplit[3] !== date) {
                //     errs.push(`${filename} - Date does not match`);
                //     continue;
                // }
                
                const shop = shopsFiltered.find(shop => shop.code === shopCode);

                if(!shop) {
                    errs.push(`${filename} - Shop not found`);
                    continue;
                }                

                if( ext !== 'xlsx' && ext !== 'csv' ) {
                    errs.push(`${filename} is not an excel file`);
                    continue;
                }
                    
                // validate file size
                const size = await file.async('nodebuffer')
                    .then((bytes) => {
                        const fileMb = parseFloat((bytes.byteLength / (1024 * 1024)).toFixed(2));
                    
                        if( fileMb > excelMbLimit ) return {error : `The file ${file.name} has a size higher than permitted`};
                    
                        return { data: bytes};
                    }).catch((e) => {
                        return {error: e};
                    });
                    
                if( size['error'] ) {
                    errs.push(size['error']);
                    continue;
                }

                const bytesStr = await file.async('binarystring');
                const res = await load(bytesStr);

                if( res['errs'] ) errs.push(res['errs']);
                
                if(res['merged']) no_loaded.push(res['merged']);

                if( res['ok'] ) uploaded += res['ok'];
                    
            }

            }).catch(e => {
                console.log(`Zip upload error: ${e}`);
                errs.push(e.message);
            });

        return Rest.response({
            res,
            message :  `${ uploaded } records uploaded`,
            data    : {no_loaded, errs},
        });

    } catch(e){
        console.log(`zip-excel controller error: ${e}`);
        return Rest.response({res, message: e.message});
        
    }
}

const load = async (bstr): Promise<any> => {
    const res = await ExcelService.readFileBytes(bstr);
    const dataloaded = await loadData(res);
    return dataloaded;
}

const loadData = async({results, header, meta}) => {
    let data = [];
    
    let productsSvc = new ProductsService;
    const products  = await productsSvc.getAllProducts();    

    for(let row of results) {        
        let product = products.find(product => product.sku == row['ID Producto']);
        
        if(!product) continue;

        const product_cat = products_cats.find(p => p.sku == product.sku);

        if( !product_cat ) continue;

        if( product.image ) continue;

        if( row['Cantidad Inventario'] == 0 ) continue;

        let obj = {
            discount    : row['Precio con descuento'],
            price       : row['Precio de Venta con IVA'],
            product_sku : row['ID Producto'],
            quantity    : row['Cantidad Inventario'],
            code_shop   : `${ row['CECO'] }${ product_cat.Categoria_tienda }`,
        };
        
        data.push(obj);
    }
    
    
    const {ok, errs, merged} = await divideArr(data, 500);

    return {ok, errs, merged};
}

const divideArr = async(arr: any[], size: number=8) => {
    let temp = [], to_excel = [], ok=0, errs = [];

    while(arr.length > 0) temp.push(arr.splice(0, size));

    const inventoriesSvc = new InventoriesService;

    console.log(temp);
    

    for await(let item of temp) {
        // const res = await inventoriesSvc.createWithJSON(item);

        // if( !res ) {
        //     errs.unshift(`the products from SKU ${ item[0]['product_sku'] } to ${ item[item.length - 1]['product_sku'] } could not able uploaded`);

        //     const objs = arr.map(obj => obj);
        //     to_excel.push(objs);
        //     continue;
        // }
        
        ok += item.length;
        errs.unshift(` products from SKU ${ item[0]['product_sku'] } to ${ item[item.length - 1]['product_sku'] } has been uploaded`);

        const objs = arr.map(obj => obj);
        to_excel.push(objs);
        
    }

    let merged = [].concat.apply([], to_excel);

    return {ok, errs, merged};
}

export {
    upload,
}

