import HttpService from "./http.service";

class InventoriesService {

    private http;

    constructor() {
        this.http = new HttpService;
    }

    async createWithJSON(payload) {
        const res = await this.http.post('api/spatial/inventory/uploadByJson', payload);
        if( res ) return res.data;
        return res;
    }
}

export default InventoriesService;
