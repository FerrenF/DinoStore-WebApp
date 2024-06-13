
import { loadTemplate } from '../templateEngine.js';
import { Settings } from '../model/settings.js'
import {debugMessage, getQueryParam} from "../common.js";
import {Cart} from "../model/cart.js";
import {navigateTo} from "../routes.js";

export function cartController() {


    const contextGatherer = {}
    async function initialize_cart() {
        contextGatherer.settings = await Settings.getAll()
        contextGatherer.storedCartID = Cart.getStoredCartID()
        if(contextGatherer.storedCartID){
            contextGatherer.cart = await Cart.getById(contextGatherer.storedCartID)
        }

        if(!contextGatherer.cart){
            debugMessage(`Cart request returned null.`, "ERROR");
            return Promise.resolve({'status':'success'})
        }

        let currentPath = window.location.pathname;

        //      /cart/<command>/<id>/<qty>
        // e.g. /cart/add/5/3
        // e.g. /cart/add/5/3
        // e.g. /cart/remove/5/2
        // e.g. /cart/remove/5
        // e.g. /cart/clear

        let parts = currentPath.split('/').filter(part => part !== ''); // Remove empty parts
        if (parts.length >= 2 && parts[0] === 'cart') {
            let command = parts[1];
            debugMessage(`Cart Command: ${command}`, "INFO");

            if (command === 'add') {
                let itemId = parseInt(parts[2]);
                let qty = parseInt(parts[3]);
                debugMessage(`Adding item ID ${itemId} with quantity ${qty} to cart.`, "INFO");

                if (!isNaN(itemId) && !isNaN(qty)) {
                    await contextGatherer.cart.addItem(itemId, qty);
                    debugMessage(`Item added successfully.`, "INFO");
                } else {
                    debugMessage(`Invalid item ID or quantity.`, "ERROR");
                }
            } else if (command === 'remove') {
                let itemId = parseInt(parts[2]);
                let qty = parseInt(parts[3]);
                debugMessage(`Removing item ID ${itemId} with quantity ${qty} from cart.`, "INFO");

                if (!isNaN(itemId)) {
                    if (!isNaN(qty)) {
                        await contextGatherer.cart.removeItem(itemId, qty);
                        debugMessage(`Item removed successfully.`, "INFO");
                    } else {
                        await contextGatherer.cart.removeItem(itemId);
                        debugMessage(`Item removed successfully.`, "INFO");
                    }
                } else {
                    debugMessage(`Invalid item ID.`, "ERROR");
                }
            } else if (command === 'clear') {
                debugMessage(`Clearing cart.`, "INFO");
                await contextGatherer.cart.clearCart();
                debugMessage(`Cart cleared successfully.`, "INFO");
            } else {
                debugMessage(`Invalid command: ${command}`, "ERROR");
            }
        } else {
            debugMessage(`No cart command found in the URL.`, "INFO");
        }
        return Promise.resolve({'status':'success'})
    }

    initialize_cart().then(()=>{
        let returnUrl = decodeURI(getQueryParam('returnUrl') || '/');
        navigateTo(returnUrl,false)
    })
}