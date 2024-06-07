const {set_up_server_routes, set_up_client_routes} = require("./server/routes");


const PORT = process.env.PORT || 3050
const SERVER_PORT = PORT + 1
var express = require('express');
var path = require('path');

//let applicationRouter = require('./application/routes');

var serverApp = express();
serverApp.use(express.urlencoded({extended:true}));
var clientApp = express();
clientApp.use(express.urlencoded({extended:true}));

//app.use('/application/', applicationRouter);
const cors = require('cors');
const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
serverApp.use(cors(corsOptions));

// Step 1: initialize the server before using its routing
const {serverApplication} = require('./server/init')

// Step 2: Set up routes
set_up_server_routes(serverApp, serverApplication)
set_up_client_routes(clientApp)

clientApp.listen(PORT,()=> console.info(`Client has started on ${PORT}`))
serverApp.listen(SERVER_PORT,()=> console.info(`Server has started on ${SERVER_PORT}`))

module.exports = serverApp;