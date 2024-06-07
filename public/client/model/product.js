
import {apiRequest, debugMessage} from "../common.js"
export class Product {
    constructor(data) {
        this.id = data.id;
        this.product_name = data.product_name;
        this.product_title = data.product_title;
        this.product_short_description = data.product_short_description;
        this.product_description = data.product_description;
        this.product_image = data.product_image;
        this.product_image_alt = data.product_image_alt;
        this.product_weight = data.product_weight;
        this.product_weight_unit = data.product_weight_unit;
        this.product_price = data.product_price;
        this.product_price_unit = data.product_price_unit;
        this.product_tags = data.product_tags;
    }

    static getById(productId) {
        return apiRequest(`products/id/${productId}`)
            .then(data => new Product(data))
            .catch(error => {
                debugMessage(`Failed to fetch product by ID: ${error.message}`, 'ERROR');
                throw error;
            });
    }

    static getByName(productName) {
        return apiRequest(`products/name/${productName}`)
            .then(data => new Product(data))
            .catch(error => {
                debugMessage(`Failed to fetch product by name: ${error.message}`, 'ERROR');
                throw error;
            });
    }

    static getAll() {
        return apiRequest(`products`)
            .then((data) => {
                let rawList = Array.from(data)
                if(rawList.length){
                    return rawList.map((product)=>new Product(product))
                }
                return rawList
            })
            .catch(error => {
                debugMessage('Failed to fetch product catalog.', 'ERROR');
                throw error;
            });
    }
}