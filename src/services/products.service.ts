import HttpService from "./http.service";

class ProductsService {

    private http: any;
    
    constructor() {        
        this.http = new HttpService();
    }

    async getAllProducts() {
        const res = await this.http.get('api/products');
        if( res ) return res.data;
        return res;
    }
}

export default ProductsService;
