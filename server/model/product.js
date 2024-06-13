const { Products } = require('./products.js');
const {JsonDataSource} = require("../jsonDataSource");

class Product {
    constructor(applicationObject) {
        this.applicationObject = applicationObject
        this.dataSourceName = 'products'
        this.products = new Products(this.applicationObject)
    }

    get_by_id = (id) => {
        let productAttr = parseInt(id, 10);
        let product = this.products.products.find(p => p.id === productAttr);
        if (product) {
            product.next_id = this.products.get_next_used_product_id(productAttr+1);
            return product;
        } else {
            return false;
        }
    }

    get_by_name = (name) => {
        let product = this.products.products.find(p => p.product_name === name);
        if (product) {
            product.next_id = this.products.get_next_used_product_id(parseInt(product.id,10)+1);
            return product;
        } else {
            return false;
        }
    }
}

module.exports = { Product };