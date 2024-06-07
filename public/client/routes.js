import { indexController } from './controller/indexController.js';
//import { productController } from './productController.js';

function router() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const searchParamsJson = searchParamsToJson(searchParams);
    const content = document.getElementById('page-content');

    if (path === '/') {
        indexController(searchParamsJson);
        console.log('index requested');
    } else if (path.startsWith('/product/')) {
        const productId = path.split('/').pop();
        console.log(productId);
        //productController(productId, searchParamsJson);
    } else {
        content.innerHTML = '<p>Page not found.</p>';
    }
}
export function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

export function init_router(){
    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', router);

    // Initial route
    router();
}
