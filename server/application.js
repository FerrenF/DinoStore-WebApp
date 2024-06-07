

// modify settings here
const serverApplicationObject = {
    "settings" : {
        "dataSources" : ["json:./data/applicationData.json","json:./data/adData.json"]
    }
}


// don't modify these
serverApplicationObject["routes"]={}
serverApplicationObject["sources"]={}

module.exports = {serverApplicationObject}