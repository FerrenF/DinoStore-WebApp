class products  {
    constructor(applicationObject) {
        this.applicationObject = applicationObject
    }

    get_products = () => {
        if (this.applicationObject.hasOwnProperty('products')) {
            return this.applicationObject.products;
        } else {
            return false
        }
    }

    get_num_products = () => {
        if (this.applicationObject.hasOwnProperty('products')) {
            return Array.from(this.applicationObject.products).length;
        } else {
            return false
        }
    }

    get_next_open_product_id = (from_id=0) => {
        if (this.applicationObject.hasOwnProperty('products')) {
            let search_ids = Array.from(this.applicationObject.products.filter((x)=>x.id > from_id).map((x)=>x.id))
            let max_id = 0
            let id_counter = from_id
            for(let used_id in search_ids){
                let distance_from_previous = (id_counter - used_id)
                if(distance_from_previous>1){
                    for(let i=0;i<distance_from_previous;i++){
                        let test = used_id+i;
                        if(!(test in search_ids)){
                            return test
                        }
                    }
                }
                id_counter=used_id
                max_id = used_id > max_id ? used_id : max_id;
            }
            return max_id+1
        } else {
            return false
        }
    }

    add_product = (params) => {

    }

    remove_product = (params) => {

    }
}

module.exports={products}