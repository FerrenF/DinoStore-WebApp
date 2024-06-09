Let's try making a readme again.



# Dino-Store
## Dinosaurs direct to your doorstep.

Server Structure:

The server takes a few shortcuts in that the models that we use on it are not true MVC models.
They are just API helper functions that return data from our datasource.

All API routes return JSON.

* model
  * Ad - Returns ad data
  * appSettings - Returns app settings in bulk
  * product - Returns individual product data
  * products - returns information about all of our products.
* application.js - Constants and configuration
* jsonDataSource - Interacts with JSON data
* routes - Adds routes for both client and server into express.
* init - Server initialization.

Client Structure:

Client side MVC.

All routes exposed to the client lead to the same place -> index.html.
This html file is responsible for loading the client initialization script, /client/dinoStore.js, so that the content can be injected.

The initialization file, dinoStore.js, calls three methods: our router method, and event hooks.
The router file, routes.js, looks at the URL in the current window and determines which controller to pass to. Controllers are located in /client/controller.
The controller files are responsible for gathering common context used by template variables, and then it pulls the viewTemplate for the page from the templates directory.
This file is passed into the templateEngine and content is dynamically injected into it based on a set of rules.
Once the template engine is done creating our view and filling out variables, the data is passed back to load_html_into_body located within routes.js. This method creates a virtual dom,
and then recurses through the DOM in the current window to perform visual updates on the fly.

It's like a mini-react. No page reloads are made; the URL in the navigation bar is manipulated directly but you can still enter the app at any point using the URL.

* public/client - root application folder
  * controller - controls what we see when we get to the place we want to
  * model - contains models whose purpose is to retrieve data from the server
  * templates - controls definitions of what we are supposed to see
  * routes.js - has discretion over which controller to pass local reqests to
    * Also contains the code related to DOM diffing. I should move this to templateEngine.
  * templateEngine - contains code related to manipulation of templates
  * common.js - contains common functions including debug
  
Notes:
    404 errors are normal. Templates may or may not have paired javascript files that are loaded when the template is.
    