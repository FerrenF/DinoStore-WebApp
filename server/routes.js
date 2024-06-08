
const {Product} = require("./model/product");
const {settings} = require("./model/appSettings");
const {Products} = require("./model/products");
const {ad} = require("./model/ad");
const path = require("path");
const express = require("express");
// routes.js serves our REST api route controllers

/*
    friendly_send
        friendly_send simply wraps whatever object it's sending to the response in JSON, and then attaches
        headers that allow cross-origin resource sharing to happen.
 */
function friendly_send(res, obj){
    //'Access-Control-Allow-Origin'
    // I had to do this to host on different ports from the same script.
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.send(JSON.stringify(obj))
}


/*
    set_up_server_routes
        set_up_server_routes takes an express applicationObject and registers routes to appropriate server API methods.
 */
function set_up_server_routes(serverApp, applicationObject){

    // Route to get settings
    serverApp.get('/settings', (req, res) => {
        friendly_send(res, new settings(applicationObject).get());
    });

    // Route to return tag list
    serverApp.get('/tags', (req, res) => {
        friendly_send(res, new Products(applicationObject).get_product_tags())
    });

    // Route to get a specific product by ID
    serverApp.get('/products/id/:id', (req, res) => {
        friendly_send(res, new Product(applicationObject).get_by_id(req.params.id))
    });

    // Route to get a specific product by ID
    serverApp.get('/products/:id', (req, res, next) => {
        if(req.params.id === "count"){
            friendly_send(res, new Products(applicationObject).get_num_products())
        }
        else {
            friendly_send(res, new Product(applicationObject).get_by_id(req.params.id))
        }
    });

    // Route to get a specific product by product_name
    serverApp.get('/products/name/:product_name', (req, res) => {
        friendly_send(res, new Product(applicationObject).get_by_name(req.params.product_name))
    });

    // Route to get all products with optional search and filter
    serverApp.get('/products', (req, res) => {
        const { searchProperties, search, filter } = req.query;
        const searchTerms = search ? search.split(',') : ["*"];
        const searchProps = searchProperties ? searchProperties.split(',') : ["product_name", "product_title", "product_description", "product_short_description"];
        const tagFilters = filter ? filter.split(',') : [];

        friendly_send(res, new Products(applicationObject).get_products(searchTerms, searchProps, tagFilters));
    });

    serverApp.get('/ads', (req, res) => {
        friendly_send(res, new ad(applicationObject).get_all())
    });

    serverApp.get('/ads/:name', (req, res) => {
        friendly_send(res, new ad(applicationObject).get_by_name(req.params.name))
    });

    serverApp.get('/ads/type/:adtype', (req, res) => {
        friendly_send(res, new ad(applicationObject).get_all(req.params.adtype))
    });

}


/*
        set_up_client_routes
            set_up_client_routes redirects all routes on the client port, minus those requests that refer to an individual file and
            public folders, to the index.html page within the public directory.
 */
function set_up_client_routes(clientApp){
    clientApp.get(/^\/(?!.*\.[a-zA-Z0-9]+$)(.*)$/, (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    clientApp.use(express.static(path.join(__dirname, '../public')));
}

module.exports = {set_up_server_routes, set_up_client_routes}