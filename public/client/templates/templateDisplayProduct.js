export function init_template(context) {
    return Promise.resolve({"status":"success"})
}

export function get_encoded_path(){
    return encodeURIComponent(window.location.pathname);
}

export function get_price_string(context){
    return context.product ? new Intl.NumberFormat('en-US', { style: 'currency', currency: context.settings.priceUnit }).format(context.product.product_price)
        : "N/A";
}
