# Dino-Store
## Dinosaurs direct to your doorstep.

This project is an example of a client-side rendering application that utilizes dom diffing to make a seamless
experience through different data views. 

Features include:
- A server-side cart with client-side stored cart ID.
- Popstate control enabling browser forward/backward navigation.
- Template engine with dynamic script injection for async data.
- Live DOM updates through virtual dom usage and dom-diffing.
- Server side REST api to distribute information from multiple data sources.
- Lot's more. It's fancy.

### Prerequisites
This application requires Node.JS and express. No additional packages are needed.


### Installation


Server Structure:

All API routes return JSON or a valid error code.

Server Routes:
- GET /settings
- GET /tags
- GET /products/id/:id      
- GET /products/:id
- GET /products/name/:product_name
- GET /products
- GET /ads
- GET /ads/:name
- GET /ads/type/:adtype
- GET /carts/:id
- POST /carts/create
- PUT /carts/:id
- DELETE /carts/:id
- POST /carts/:id


Related Files/Directories:

* model
  * Ad - Returns ad data
  * appSettings - Returns app settings
  * product - Returns individual product data
  * products - returns information about all of our products.
  * carts - manages the carts stored in cartData
* application.js - Constants and configuration
* jsonDataSource - Interacts with JSON data
* routes - Adds routes for both client and server into express.
* init - Server initialization.

Client Structure:


For the client, all routes except direct file links and resource directories redirect to index.html in the public folder.
This html file is responsible for loading the client initialization script, /client/dinoStore.js.

The initialization file, dinoStore.js, initializes our router and hooks window events so we can navigate seamlessly with natural links.
The router file, routes.js, looks at the URL in the current window and determines which controller to pass to. Controllers are located in /client/controller.
The controller files are responsible for gathering common context and template info used by their associated template, or performing url actions.
If a controller loads a template, the templateEngine ensures that content is dynamically injected into it based on a simple syntax. 
The processed template is passed into load_html_into_body in domUpdate.js. This method creates a virtual dom,
and then recurses through the DOM in the current window to perform visual updates on the fly.

It's like a mini-react. 

No page reloads are made, even though the URL in the navigation bar changes and it is manipulated directly by the application.
You can still enter the app at any point using the associated URL and proceed from there.

* public/client - root application folder
  * controller - controls initial view and sub-templates, as well as url actions
  * model - contains models whose purpose is to retrieve data from the server
  * templates - contains views, templates, and the logic associated with them
  * routes.js - has discretion over which controller to pass reqests to
  * domUpdate.js - contains dom-diffing code
  * templateEngine - contains template methods
  * common.js - contains common functions including debug
  
Notes:
    404 errors are normal. Templates may or may not have paired javascript files that are loaded when the template is.
    
    