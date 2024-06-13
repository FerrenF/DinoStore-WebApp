import { debugMessage, setQueryParam } from "../common.js";
import { Cart } from "../model/cart.js";
import {Product} from "../model/product.js";


export function init_template(context) {
    let generatedSession = false;
    return get_cart_session()
        .then(cartSession => {
            if (!cartSession) {
                debugMessage(`Cart ID not found, requesting new ID from server...`, 'INFO');
                generatedSession = true;
                return request_cart_session();
            }
            return cartSession;
        })
        .then(cartSession => {
            if (!cartSession) {
                debugMessage(`Sidebar cart failed to retrieve a new cart ID. Your products may not be saved.`, 'ERROR');
                return Promise.resolve({ "status": "error" });
            } else {
                debugMessage(`Cart ID ${cartSession.id} ${(generatedSession?'generated' :'retrieved')}.`, 'INFO');
                context.cart = cartSession;
                return cartSession;
            }
        })
        .then(cartSession => {
            if (cartSession && context.cart.items) {
                let idArray = Object.keys(context.cart.items);
                return Product.getList(idArray).then(pListResult => {
                    context.cartData = pListResult || [];
                    let runningTotal = 0;

                    // believe it or not, cart price method
                    pListResult.forEach((v)=>runningTotal+=(v.product_price*context.cart.items[v.id]));
                    const priceString = new Intl.NumberFormat('en-US', { style: 'currency', currency: context.settings.priceUnit }).format(runningTotal);
                    context.cartTotal = priceString;
                    return cartSession;
                });
            }
            return cartSession;
        })
        .catch(error => {
            debugMessage(`An error occurred: ${error.message}`, 'ERROR');
            return Promise.resolve({ "status": "error" });
        });
}

async function get_cart_session() {
    const storedCartID = Cart.getStoredCartID();
    if (storedCartID) {
        const cartSession = await Cart.getById(storedCartID);
        if (cartSession) {
            return cartSession;
        }
    }
    return false;
}

async function request_cart_session() {
    const newCart = await Cart.requestNewCart();
    if (newCart) {
        newCart.storeCartID();
        return newCart;
    }
    return false;
}

const make_sidebar_cart_item = (sidebarCartItem) => {
    return `
    <li class="cart-item">
        <span class="item-name"><a href="/products/name/${sidebarCartItem.product_name}">${sidebarCartItem.product_name}</a></span>
        <span class="quantity-controls">
            <a href="/cart/remove/${sidebarCartItem.id}/1?returnUrl=${encodeURIComponent(window.location.pathname)}" class="quantity-minus">-</a>
            <span class="item-quantity">${sidebarCartItem.qty}</span>
            <a href="/cart/add/${sidebarCartItem.id}/1?returnUrl=${encodeURIComponent(window.location.pathname)}" class="quantity-plus">+</a>
        </span>
        <span class="item-price">${sidebarCartItem.priceString}</span>
    </li>`;
};

const make_sidebar_cart_no_item = () => {
    return `
    <li class="cart-item">
        <span class="item-name">Add something to your cart!</span>       
    </li>`;
};

export function get_sidebar_cart_html(context, parentTemplate) {
    let resultHtml = document.createElement('DIV');
    function loadHtmlCart(context) {
        let cart = context.cart.items;
        if (cart && context.cartData && Object.entries(cart).length>0) {
            try {
                Object.entries(cart).forEach(([k, v]) => {
                    let itemQty = v;
                    let itemDat = context.cartData.find((product) => product.id == k);
                    if (itemDat) {
                        itemDat["qty"] = v;
                        const priceString = new Intl.NumberFormat('en-US', { style: 'currency', currency: context.settings.priceUnit }).format(itemDat.product_price);
                        itemDat.priceString = priceString;
                        context.sidebarCartItem = itemDat;
                        resultHtml.innerHTML += make_sidebar_cart_item(itemDat);
                    }
                });
            } catch (e) {
                debugMessage(`Problem loading cart information from local data: ${e.message}`, 'ERROR');
            }
        }
        else
        {
            resultHtml.innerHTML += make_sidebar_cart_no_item();
        }
        return resultHtml.innerHTML;
    }

    if (context.cartData) {
        return loadHtmlCart(context);
    } else {
        debugMessage('Cart data is not available', 'ERROR');
        return '';
    }
}

export function get_encoded_path(){
    return encodeURIComponent(window.location.pathname);
}
