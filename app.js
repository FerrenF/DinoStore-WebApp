const {set_up_server_routes, set_up_client_routes} = require("./server/routes");

const PORT = process.env.PORT || 3050
const SERVER_PORT = PORT + 1



var express = require('express');
var serverApp = express();
serverApp.use(express.urlencoded({extended:true}));

var clientApp = express();
clientApp.use(express.urlencoded({extended:true}));

// Our server is running on a different port then the client. Due to modern protocol restrictions, this means that
// cross-origin resource sharing (CORS)

// We could leave this out if we had the server handing out resources on the same port the client is connected on

// But if we do that, then we can not use the URLs to enter points within the main application (I mean, you COULD use queryParams to store path, but having urls that make sense helps UX)

// This is an example app, or a demo, if you want to call it. The restrictions below are UNSAFE for production in any environment where value is involved.
const cors = require('cors');
const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
serverApp.use(cors(corsOptions));

//
//
// Server Initialization
//
//

// Step 1: initialize the server before using its routing
const {serverApplication} = require('./server/init')

// Step 2: Set up routes
set_up_server_routes(serverApp, serverApplication)
set_up_client_routes(clientApp)

clientApp.listen(PORT,()=> console.info(`Client has started on ${PORT}`))
serverApp.listen(SERVER_PORT,()=> console.info(`Server has started on ${SERVER_PORT}`))

module.exports = serverApp;