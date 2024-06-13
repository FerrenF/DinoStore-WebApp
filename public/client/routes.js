import {indexController} from './controller/indexController.js';
import {productController} from './controller/productController.js';
import {debugMessage} from './common.js'
import {load_page_into_body} from "./domUpdate.js";
import {productsController} from "./controller/productsController.js";
import {cartController} from "./controller/cartController.js";

function router() {
    const path = window.location.pathname;

    if (path === '/'||path==="/application/"||path==="/application") {
        return indexController()
    }
    else if (['/products/','/products'].indexOf(path)>-1) {

        return productsController()
    } else if (path.startsWith('/products/')) {

        const productId = path.split('/').pop();
        return productController(productId)
    }
    else if (path.startsWith('/cart/')) {
        return cartController()
    }
    return new Promise.resolve(function(resolve, reject) {
      resolve('<p>Page not found.</p>')
        // TODO: Make a page for this. It'll be easy.
    })
}

export function initRouter(){
    router().then((result)=>{
        document.getElementById('page-content').innerHTML = result;
        load_page_into_body(result)
    }).catch((e)=>debugMessage('Error loading router: '+e.message,'ERROR'));
}

export function navigateTo(url, load_page=true) {
    history.pushState(null, null, url);
    debugMessage('Changing URL to '+url,'INFO');
    return router().then((contentBody) => {
        load_page_into_body(contentBody)
    });
}


/*
    hookPopstateEvents
        Listen for popstate events (back/forward navigation)
 */
export function hookPopstateEvents(){
    debugMessage('Attempting to hook popstate (Forward/Back Browser Control)...', 'INFO');
    window.addEventListener('popstate', ()=>{
        router().then((contentBody)=>{
            load_page_into_body(contentBody)
        });
    });
}

export function hookAllHrefTags() {
    debugMessage('Attempting to hook clicks to all href tags...', 'INFO');
    document.addEventListener('click', function(event) {
        let target = event.target;
        if (target.tagName.toLowerCase() === 'a') {
            handleLinkClick(event, target);
        } else {
            while (target.parentElement) {
                target = target.parentElement;
                if (target.tagName.toLowerCase() === 'a') {
                    handleLinkClick(event, target);
                    break;
                }
            }
        }
    });
}

function handleLinkClick(event, link) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const href = link.getAttribute('href') || '/';
    navigateTo(href);
}

export function hookAllFormSubmissions() {
    debugMessage('Attempting to hook all form submissions...', 'INFO');
    document.addEventListener('submit', function(event) {
        let target = event.target;
        if (target.tagName.toLowerCase() === 'form') {
            handleFormSubmit(event, target);
        } else {
            while (target.parentElement) {
                target = target.parentElement;
                if (target.tagName.toLowerCase() === 'form') {
                    handleFormSubmit(event, target);
                    break;
                }
            }
        }
    });
}

function handleFormSubmit(event, form) {
    event.preventDefault();
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    const url = new URL(form.action);
    navigateTo(url.pathname + '?' + new URLSearchParams(formObject).toString());
}


