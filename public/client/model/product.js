
import {debugMessage} from "../common.js"
import {apiRequest} from "../apiRequest.js";
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
        this.next_id = data.next_id;
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
                debugMessage(`Failed to fetch product by name (${productName})\nError: ${error.message}`, 'ERROR');
                throw error;
            });
    }

    static getAll(searchTerms = ["*"], searchProperties = ["product_name", "product_title", "product_description", "product_short_description"], tagFilters = []) {
        let url = 'products';

        // Only add query parameters if searchTerms are not default or if tagFilters is not empty
        if (!(searchTerms.length === 1 && searchTerms[0] === "*") || tagFilters.length > 0) {
            const params = new URLSearchParams();
            if (!(searchTerms.length === 1 && searchTerms[0] === "*")) {
                params.append('search', searchTerms.join(','));
                params.append('searchProperties', searchProperties.join(','));
            }
            if (tagFilters.length > 0) {
                params.append('filter', tagFilters.join(','));
            }
            url += `?${params.toString()}`;
        }

        return apiRequest(url)
            .then((data) => {
                let rawList = Array.from(data);
                if (rawList.length) {
                    return rawList.map(product => new Product(product));
                }
                return rawList;
            })
            .catch(error => {
                debugMessage('Failed to fetch product catalog.', 'ERROR');
                throw error;
            });
    }

    static getAllTags() {
        return apiRequest(`tags`)
            .then(data => data)
            .catch(error => {
                debugMessage(`Failed to fetch tag list for produucts\nError: ${error.message}`, 'ERROR');
                throw error;
            });
    }
    static getCount() {
        return apiRequest(`products/count`)
            .then(data => {return data})
            .catch(error => {
                debugMessage(`Failed to fetch product count. \nError: ${error.message}`, 'ERROR');
                throw error;
            });
    }
}