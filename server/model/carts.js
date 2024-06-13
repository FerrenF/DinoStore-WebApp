
const {JsonDataSource} = require("../jsonDataSource");
const {debugMessage} = require("../common");


function generateUUID() {
    const timestamp = Date.now().toString(36);
    const randomValues = Array.from({ length: 8 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
    return `${timestamp}-${randomValues}`;
}

class cart {
    /*
        The carts file looks like this:
         {
          "carts": {
            "1278ne9781h2": {   // A randomly generated ID stored on the client side.
                "last_access":"now",    // The last access time for purging purposes
                    "items": {  // A list of item IDs and quantities.
                            "2" : 2
                         }
                    }
                }
            }
     */
    constructor(applicationObject) {
        this.applicationObject = applicationObject;
        this.dataSourceName = 'carts';
        this.dataSource = this.applicationObject.settings.dataSources[this.dataSourceName];
        this.dataSourceInstance = new JsonDataSource(this.dataSource);
        this.carts = this.dataSourceInstance.read("carts") || {};
    }

    saveCarts() {
        this.dataSourceInstance.update("carts", this.carts);
        this.dataSourceInstance.save();
    }

    get_by_id = (id) => {
        return {...this.carts[id], "id": id} || false;
    }

    run_cart_purge() {
        try {
            debugMessage(`Running cart purge process.`, 'INFO');

            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            Object.keys(this.carts).forEach(id => {
                if (new Date(this.carts[id].last_access).getTime() < oneHourAgo) {
                    delete this.carts[id];
                    debugMessage(`Cart with ID ${id} purged due to inactivity.`, 'INFO');
                }
            });

            this.saveCarts();
            debugMessage(`Cart purge process completed.`, 'INFO');
        } catch (error) {
            debugMessage(`Error running cart purge process: ${error.message}`, 'ERROR');
        }
    }

    add_to_cart(id, item, qty = 1) {
        try {
            debugMessage(`Adding ${qty} of item ${item} to cart with ID ${id}.`, 'INFO');

            if (!this.carts[id]) {
                debugMessage(`Cart with ID ${id} not found. Unable to add item.`, 'INFO');
                return false;
            }

            if (!this.carts[id].items[item]) {
                this.carts[id].items[item] = 0;
            }

            this.carts[id].items[item] += qty;
            this.carts[id].last_access = new Date().toISOString();
            this.saveCarts();

            debugMessage(`Item ${item} added to cart with ID ${id}. Cart updated: ${JSON.stringify(this.carts[id])}`, 'INFO');
            return true;
        } catch (error) {
            debugMessage(`Error adding item ${item} to cart with ID ${id}: ${error.message}`, 'ERROR');
            return false;
        }
    }

    remove_from_cart(id, item, qty = 999) {
        if (!this.carts[id] || !this.carts[id].items[item]) {
            return false;
        }
        this.carts[id].items[item] -= qty;
        if (this.carts[id].items[item] <= 0) {
            delete this.carts[id].items[item];
        }
        this.carts[id].last_access = new Date().toISOString();
        this.saveCarts();
        return true
    }

    delete_cart(id) {
        try {
            debugMessage(`Deleting cart with ID ${id}.`, 'INFO');

            if (this.carts[id]) {
                delete this.carts[id];
                this.saveCarts();
                debugMessage(`Cart with ID ${id} deleted.`, 'INFO');
                return true;
            } else {
                debugMessage(`Cart with ID ${id} not found.`, 'INFO');
                return false;
            }
        } catch (error) {
            debugMessage(`Error deleting cart with ID ${id}: ${error.message}`, 'ERROR');
            return false;
        }
    }

    create_new_cart() {
        try {
            //
            //  PURGE STEP
            //
            this.run_cart_purge();
            const newCartId = generateUUID();
            debugMessage(`Creating new cart with ID ${newCartId}.`, 'INFO');

            this.carts[newCartId] = {
                last_access: new Date().toISOString(),
                items: {}
            };
            this.saveCarts();
            debugMessage(`New cart created with ID ${newCartId}.`, 'INFO');
            return newCartId;
        } catch (error) {
            debugMessage(`Error creating new cart: ${error.message}`, 'ERROR');
            return false;
        }
    }

    update_cart(id, cart_list) {

        debugMessage(`Cart update requested for id ${id} with list ${JSON.stringify(cart_list)}.`,'INFO')
        if (!this.carts[id]) {
            debugMessage(`Cart id ${id} not found.`,'INFO')
            return false;
        }

        Object.keys(this.carts[id].items).forEach(item => {
            if (!(item in cart_list)) {
                delete this.carts[id].items[item];
            }
        });

        Object.keys(cart_list).forEach(item => {
            const qty = cart_list[item];
            if (qty === 0) {
                delete this.carts[id].items[item];
            } else {
                this.carts[id].items[item] = qty;
            }
        });

        debugMessage(`Cart id ${id} updated: ${JSON.stringify(this.carts[id].items)}`,'INFO')
        this.carts[id].last_access = new Date().toISOString();
        this.saveCarts();
        return true;
    }

}

module.exports = { cart };