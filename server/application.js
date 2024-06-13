

// modify settings here
const serverApplicationObject = {
    "settings" : {
        "dataSources" : {
            'settings' : "./data/applicationData.json",
            'products' : "./data/applicationData.json",
            'product' : "./data/applicationData.json",
            'ads' : "./data/adData.json",
            'carts': "./data/cartData.json"
        }
    }
}

// don't modify these
serverApplicationObject["routes"]={}
serverApplicationObject["sources"]={}

module.exports = {serverApplicationObject}