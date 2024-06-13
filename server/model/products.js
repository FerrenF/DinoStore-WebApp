const {JsonDataSource} = require("../jsonDataSource");

class Products  {
    constructor(applicationObject) {
        this.applicationObject = applicationObject
        this.dataSourceName = 'products'
        this.dataSource = this.applicationObject.settings.dataSources[this.dataSourceName]
        this.products = new JsonDataSource(this.dataSource).read("products") || {}
    }

    // Returns products, filtered by search_terms that are compared against search_properties
    // Injects into each returned project information object the next used id, for client use.

    get_products = (search_terms = ["*"], search_properties = ["product_name", "product_title", "product_description", "product_short_description"], tag_filters = []) => {
        if (!this.products) {
            return false;
        }
        let filteredProducts = this.products;
        if (!search_terms.includes("*")) {
            filteredProducts = filteredProducts.filter(product => {
                return search_properties.some(property => {
                    return search_terms.some(term => {
                        if (product.hasOwnProperty(property)) {
                            return product[property].toString().toLowerCase().includes(term.toLowerCase());
                        }
                        return false;
                    });
                });
            });
        }

        // Filter products based on tag_filters
        if (tag_filters.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                return tag_filters.every(tag => product.product_tags.includes(tag));
            });
        }

        // Map products to include the next_id property
        return filteredProducts.map(product => {
            return {
                ...product,
                next_id: this.get_next_used_product_id(product.id)
            };
        });
    }

    // returns all unique tags, and a product count for each
    get_product_tags = () => {
        if (!this.products) {
            return false;
        }

        const allProducts = this.products;
        const tagCount = {};

        allProducts.forEach(product => {
            if (product.hasOwnProperty('product_tags') && Array.isArray(product.product_tags)) {
                product.product_tags.forEach(tag => {
                    if (tagCount.hasOwnProperty(tag)) {
                        tagCount[tag]++;
                    } else {
                        tagCount[tag] = 1;
                    }
                });
            }
        });

        return tagCount;
    }

    get_num_products = () => {
        if (this.products) {
            return Array.from(this.products).length;
        } else {
            return false
        }
    }

    get_product_list = (product_ids) => {
        if (this.products) {
            return this.products.filter((product)=>product_ids.indexOf(String(product.id))>-1) || [];
        } else {
            return false
        }
    }

    get_next_open_product_id = (from_id = 0) => {
        if (!this.products) {
            return from_id;
        }
        const productIds = this.products.map(product => product.id);
        let nextId = from_id;
        while (productIds.includes(nextId)) {
            nextId++;
        }

        return nextId;
    }

    get_next_used_product_id = (from_id = 0) => {
        if (!this.products) {
            return false;
        }

        const productIds = this.products.map(product => product.id).sort((a, b) => a - b);
        for (let id of productIds) {
            if (id >= from_id) {
                return id;
            }
        }
        return 0;
    }


    add_product = (params) => {

    }

    remove_product = (params) => {

    }
}

module.exports={Products}