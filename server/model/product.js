
class product  {
    constructor(applicationObject) {
       this.applicationObject = applicationObject
    }

    get_by_id = (id) => {
        let productAttr = parseInt(id, 10);
        let product = this.applicationObject.products.find(p => p.id === productAttr);
        if (product) {
            return product;
        } else {
            return false
        }
    }

    get_by_name = (name) => {
        let product = this.applicationObject.products.find(p => p.name === name);
        if (product) {
            return product;
        } else {
            return false
        }
    }

}

module.exports={product}