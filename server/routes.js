const {Product} = require("./model/product");
const {settings} = require("./model/appSettings");
const {Products} = require("./model/products");
const {ad} = require("./model/ad");
const path = require("path");
const express = require("express");
const {debugMessage} = require("./common.js");
const {cart} = require("./model/carts");
const {SERVER_API_ROOT, CLIENT_ROOT} = require("./common");


/*
    set_up_server_routes
        set_up_server_routes takes an express applicationObject and registers routes to appropriate server API methods.
 */



function set_up_server_routes(serverApp, applicationObject) {

// Our server is running on a different port then the client. Due to modern protocol restrictions, this means that
// cross-origin resource sharing (CORS)

// We could leave this out if we had the server handing out resources on the same port the client is connected on

// But if we do that, then we can not use the URLs to enter points within the main application (I mean, you COULD use queryParams to store path, but having urls that make sense helps UX)

// This is an example app, or a demo, if you want to call it. The restrictions below are UNSAFE for production in any environment where value is involved.
// As if this is going into production, hah.

    serverApp.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    serverApp.use(express.static(path.join(__dirname, '../public')));

    // Route to get settings`
    serverApp.get(SERVER_API_ROOT + 'settings', (req, res) => {
        try {
            const settingsData = new settings(applicationObject).get();
            res.json(settingsData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve settings' });
        }
    });

// Route to return tag list
    serverApp.get(SERVER_API_ROOT + 'tags', (req, res) => {
        try {
            const tags = new Products(applicationObject).get_product_tags();
            res.json(tags);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve tags' });
        }
    });

// Route to get a specific product by ID
    serverApp.get(SERVER_API_ROOT + 'products/id/:id', (req, res) => {
        try {
            const product = new Product(applicationObject).get_by_id(req.params.id);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve product' });
        }
    });

// Route to get a specific product by ID, or get products by a list of IDs
    serverApp.get(SERVER_API_ROOT + 'products/:id', (req, res, next) => {
        try {
            if (req.params.id === "count") {
                const count = new Products(applicationObject).get_num_products();
                res.json(count);
            } else if (req.params.id === "list") {
                if (req.query.ids) {
                    let splitIdString = req.query.ids.split(",");
                    if (splitIdString.length) {
                        const result = new Products(applicationObject).get_product_list(splitIdString);
                        res.json(result);
                    } else {
                        res.status(404).json({ error: 'Results empty.' });
                    }
                } else {
                    res.status(404).json({ error: 'No IDs provided.' });
                }
            } else {
                const product = new Product(applicationObject).get_by_id(req.params.id);
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve product(s)' });
        }
    });

// Route to get a specific product by product_name
    serverApp.get(SERVER_API_ROOT + 'products/name/:product_name', (req, res) => {
        try {
            const product = new Product(applicationObject).get_by_name(req.params.product_name);
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve product' });
        }
    });

    // Route to get all products with optional search and filter
    serverApp.get(SERVER_API_ROOT + 'products', (req, res) => {
        try {
            const { searchProperties, search, filter } = req.query;
            const searchTerms = search ? search.split(',') : ["*"];
            const searchProps = searchProperties ? searchProperties.split(',') : ["product_name", "product_title", "product_description", "product_short_description"];
            const tagFilters = filter ? filter.split(',') : [];
            const products = new Products(applicationObject).get_products(searchTerms, searchProps, tagFilters);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve products' });
        }
    });

    // Route to return all ad information
    serverApp.get(SERVER_API_ROOT + 'ads', (req, res) => {
        try {
            const adsData = new ad(applicationObject).get_all();
            res.json(adsData);
        } catch (error) {
            res.status(500).json({error: 'Failed to retrieve ads'});
        }
    });

    // Route to return the information of a specific ad
    serverApp.get(SERVER_API_ROOT + 'ads/:name', (req, res) => {
        const adName = req.params.name;
        try {
            const adData = new ad(applicationObject).get_by_name(adName);
            if (adData) {
                res.json(adData);
            } else {
                res.status(404).json({error: 'Ad not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'Failed to retrieve ad'});
        }
    });

    // Route to return ads of a specific type
    serverApp.get(SERVER_API_ROOT + 'ads/type/:adtype', (req, res) => {
        const adType = req.params.adtype;
        try {
            const adsData = new ad(applicationObject).get_all(adType);
            res.json(adsData);
        } catch (error) {
            res.status(500).json({error: `Failed to retrieve ads of type ${adType}`});
        }
    });

    //
    //
    // CART ROUTES
    //
    //

    // Get cart by ID
    serverApp.get(SERVER_API_ROOT + 'carts/:id', (req, res) => {
        const cartId = req.params.id;
        const cartData = new cart(applicationObject).get_by_id(cartId);
        if (cartData) {
            res.json(cartData);
        } else {
            res.status(404).json({error: 'Cart not found'});
        }
    });

    // Create a new cart
    serverApp.post(SERVER_API_ROOT + 'carts/create', (req, res) => {
        const newCartId = new cart(applicationObject).create_new_cart();
        res.json(new cart(applicationObject).get_by_id(newCartId));
    });

    // Update cart by ID
    serverApp.put(SERVER_API_ROOT + 'carts/:id', (req, res) => {
        const cartId = req.query.id;
        const cartList = JSON.parse(req.query.items);

        const updated = new cart(applicationObject).update_cart(cartId, cartList);
        if (updated) {
            res.json({message: `Cart ${cartId} updated`});
        } else {
            res.status(404).json({error: 'Cart not found'});
        }
    });

    // Delete cart by ID
    serverApp.delete(SERVER_API_ROOT + 'carts/:id', (req, res) => {
        const cartId = req.params.id;
        const deleted = new cart(applicationObject).delete_cart(cartId);
        if (deleted) {
            res.json({message: `Cart ${cartId} deleted`});
        } else {
            res.status(404).json({error: 'Cart not found'});
        }
    });

    // Add item to cart by ID
    serverApp.post(SERVER_API_ROOT + 'carts/:id', (req, res) => {
        const cartId = req.params.id;
        const {item, qty} = req.body;
        if (!item || !qty) {
            res.status(400).json({error: 'Item and quantity required'});
        } else {
            new cart(applicationObject).add_to_cart(cartId, item, qty);
            res.json({message: `Item added to cart ${cartId}`});
        }
    });


    serverApp.get(CLIENT_ROOT + 'products/*', (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    serverApp.get(CLIENT_ROOT + 'cart/*', (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    serverApp.get(CLIENT_ROOT + 'application/*', (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    serverApp.get(CLIENT_ROOT, (req, res) => {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });


}

/*
        printAvailableRoutes
            it does as it says - prints the currently registered routes in app
 */

function printAvailableRoutes(app) {
    debugMessage('Available routes:', 'REQUIRED');
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            Object.keys(middleware.route.methods).forEach((method) => {
                debugMessage(`${method.toUpperCase()} ${middleware.route.path}`, 'REQUIRED');
            });
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    Object.keys(handler.route.methods).forEach((method) => {
                        debugMessage(`${method.toUpperCase()} ${handler.route.path}`, 'REQUIRED');
                    });
                }
            });
        }
    });
}


module.exports = {set_up_server_routes, printAvailableRoutes}