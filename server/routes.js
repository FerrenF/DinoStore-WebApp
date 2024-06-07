
const {product} = require("./model/product");
const {settings} = require("./model/appSettings");
const {products} = require("./model/products");
const {ad} = require("./model/ad");
const path = require("path");
const express = require("express");
// routes.js serves our REST api route controllers


function friendly_send(res, obj){
    //'Access-Control-Allow-Origin'
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.send(JSON.stringify(obj))
}
function set_up_server_routes(serverApp, applicationObject){

    // Route to get settings
    serverApp.get('/settings', (req, res) => {
        friendly_send(res, new settings(applicationObject).get());
    });

    // Route to get a specific product by ID
    serverApp.get('/products/id/:id', (req, res) => {
        friendly_send(res, new product(applicationObject).get_by_id(req.params.id))
    });

    // Route to get a specific product by product_name
    serverApp.get('/products/name/:product_name', (req, res) => {
        friendly_send(res, new product(applicationObject).get_by_name(req.params.product_name))
    });

    serverApp.get('/products/count', (req, res) => {
        friendly_send(res, new products(applicationObject).get_num_products())
    });

    serverApp.get('/products', (req, res) => {
        friendly_send(res, new products(applicationObject).get_products())
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

// Covers all routes, minus urls with an extension, and preserves public directories
function set_up_client_routes(clientApp){
    clientApp.get(/^\/(?!.*\.[a-zA-Z0-9]+$)(.*)$/, (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    clientApp.use(express.static(path.join(__dirname, '../public')));
}

module.exports = {set_up_server_routes, set_up_client_routes}