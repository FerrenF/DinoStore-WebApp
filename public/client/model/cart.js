import {debugMessage} from "../common.js"
import {apiRequest} from "../apiRequest.js";
import {COOKIE_SAVE_TIME_DAYS} from "../config.js";
import {Product} from "./product.js";


export class Cart {

    constructor(data) {
        this.id = data.id;
        this.items = data.items || {};
        this.last_access = data.last_access;
    }

    addItem(itemId, qty) {
        if (!this.items[itemId]) {
            this.items[itemId] = 0;
        }
        this.items[itemId] += qty;
        debugMessage(`Item ID ${itemId} with qty of ${qty} added to cart.`, 'INFO');
        return this.saveCart()
    }

    clearCart() {
        this.items = {};
        debugMessage(`Cart cleared.`, 'INFO');
        return this.saveCart()
    }

    removeItem(itemId, qty) {
        if (this.items[itemId]) {
            if (this.items[itemId] > qty) {
                this.items[itemId] -= qty; // Decrement quantity
            } else {
                delete this.items[itemId]; // Remove item if quantity is 1
            }
            debugMessage(`Items removed ${qty}: ${itemId}`, 'INFO');
            return this.saveCart();
        } else {
            debugMessage(`Item not found: ${itemId}`, 'WARN');
        }
    }

    static async getById(cartId) {
        try {
            const data = await apiRequest(`carts/${cartId}`);
            if (!data) {
                return false;
            }
            data.id = cartId;
            return new Cart(data);
        } catch (error) {
            debugMessage(`Failed to fetch cart ID: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    static async requestNewCart() {
        try {
            const data = await apiRequest(`carts/create`, 'POST');
            if (!data) {
                return false;
            }
            return new Cart(data);
        } catch (error) {
            debugMessage(`Failed request new cart ID: ${error.message}`, 'ERROR');
            throw error;
        }
    }

    async deleteCart() {
        const storedCartID = Cart.getStoredCartID();
        if (storedCartID) {
            const response = await apiRequest(`carts/${storedCartID}`, 'DELETE');

            if (response) {
                document.cookie = "cartID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Delete the cookie
                debugMessage('Cart deleted successfully', 'INFO');
            } else {
                debugMessage('Failed to delete cart', 'ERROR');
            }
        } else {
            debugMessage('No cart ID found in cookies', 'ERROR');
        }
    }

    async saveCart() {
        const storedCartID = Cart.getStoredCartID();
        const cartData = {
            id: storedCartID,
            items: JSON.stringify(this.items)
        };
        const response = await apiRequest(`carts/${cartData.id}`, 'PUT', cartData);
        if (response) {
            debugMessage('Cart updated successfully', 'INFO');
        } else {
            debugMessage('Failed to save cart', 'ERROR');
        }
    }

    storeCartID() {
        const d = new Date();
        d.setTime(d.getTime() + (COOKIE_SAVE_TIME_DAYS*24*60*60*1000)); // Set cookie to expire in 1 year
        const expires = "expires=" + d.toUTCString();
        document.cookie = "cartID=" + this.id + ";" + expires + ";path=/";
        debugMessage(`Stored cart ID ${this.id} in cookie.`, 'INFO');
    }

    static getStoredCartID() {
        const name = "cartID=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                let storedId = c.substring(name.length, c.length);
                debugMessage(`Retrieved cart ID ${storedId} from cookie.`, 'INFO');
                return storedId;
            }
        }
        debugMessage('No cart ID found in cookies.', 'INFO');
        return false;
    }
}