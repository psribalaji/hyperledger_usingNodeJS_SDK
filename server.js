const express = require('express');
const bodyParser = require('body-parser');

// 1. Get the instance of the NetworkCardStoreManager
const NetworkCardStoreManager= require('composer-common').NetworkCardStoreManager;

// 2. Get instance of BusinessNetworkCardStore for filesystem based wallet
var walletType = { type: 'composer-wallet-filesystem' }
const cardStore = NetworkCardStoreManager.getCardStore( walletType );
const bnUtil = require('./bn-connection-util');
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Pivot Playground"});
});

app.get('/getcards', (req, res) =>{

    console.log('Called :')


return cardStore.getAll().then(function(cardMap){
    // Print all card names
    console.log(cardMap.keys());

    let firstCard = cardMap.keys().next().value
    // Get the firstCard - returns a promise so check .then()
    return cardStore.get(firstCard);

}).then(function(idCard){

    res.send(idCard)
    // get the user and business name
   // console.log("Pulled First Card from file system: ", idCard.getUserName(),' @ ', idCard.getBusinessNetworkName())

    // get the connection profile
    console.log("Connection Profile Name: ",idCard.getConnectionProfile().name)
    console.log(" Profile Name: ",idCard)

}).catch((error)=>{
    console.log(error)
});

})


app.post('/getLicenceDetails', (req, res) =>{

    console.log('Called :', req.body)

//In the local fabric I have 3 cards for pivot-test123 BNA I can use it accordingly
// Based on the model the transactions will get executed

if(req.body.userType == "PUBLIC"){
    console.log('Public Participant')
    bnUtil.cardName='publicUser@pivot-test123';

}else if(req.body.userType == "PRIVATE"){
    console.log('Private Participant')

    bnUtil.cardName='privateUser@pivot-test123';

}else if(req.body.userType == "ADMIN"){
    console.log('Admin Participant')

    bnUtil.cardName='admin@pivot-test123';

}

bnUtil.connect(main);

function main(error){


    return bnUtil.connection.query('selectAllLicences').then((results)=>{

        console.log('Received Licence count:', results.length)

        var   statement = 'SELECT org.pivot.licences.licence';
        
        
        // #3 Build the query object
        return bnUtil.connection.buildQuery(statement);

    }).then((qry)=>{

        // #4 Execute the query
        return bnUtil.connection.query(qry);
    }).then((result)=>{
        console.log('Received Licence count:', result);
        if(req.body.userType== "PUBLIC"){
            var final = []
            for(var i =0 ; i< result.length ; i++){
        //         var obj = {licenceName: "value1", licenceNumber: "value2"};
        // Object.assign(obj, {key3: "value3"});
        //         final.setPropertyValue
                final.push('Licence Name : ' +result[i].licenceName + ' , ' + 'Licence Id : ' +result[i].licenceId )
            }
            res.send(final)

        }else{
             res.send(result)

        }

        bnUtil.connection.disconnect();
    }).catch((error)=>{
        console.log(error);
        bnUtil.connection.disconnect();
    });
}

})



app.post('/addLicences', (req, res) =>{

    console.log('add licence Called ', req.body)

    const licenceNamespace = 'org.pivot.licences';
const type = 'licence';

// 1. Connect
const bnUtil = require('./bn-connection-util');
bnUtil.connect(main);

function main(error){
    // Check for the connection error
    if(error){
        console.log(error);
        process.exit(1);
    }

    return bnUtil.connection.getAssetRegistry(licenceNamespace+'.'+type).then((registry)=>{
        console.log('1. Received Registry: ', registry.id);

        addLicences(registry);

    }).catch((error)=>{
        console.log(error);
       // bnUtil.disconnect();
    });
}

/**
 * @param {*} registry This is of type AssetRegistry
 */
function    addLicences(registry){
    let    data = [];
    const  bnDef = bnUtil.connection.getBusinessNetwork();
    const  factory = bnDef.getFactory();
    let    licenceResource = factory.newResource(licenceNamespace,type,'licence');
    licenceResource.setPropertyValue('licenceName', req.body.licenceName);
    licenceResource.setPropertyValue('licenceId',req.body.licenceId);
   licenceResource.setPropertyValue('licenceIssuedTo',req.body.licenceIssuedTo);
   licenceResource.setPropertyValue('licenceIssuedBy',req.body.licenceIssuedBy);
   licenceResource.setPropertyValue('licenceNumber',req.body.licenceNumber);
   licenceResource.setPropertyValue('createdOn',new Date());
   //var aYearFromNow = new Date();
    

   licenceResource.setPropertyValue('licenceValidityDate',new Date());

    data.push(licenceResource);

 

    return registry.addAll(data).then(()=>{
        res.send('Added the Resources successfully!!!')
        console.log('Added the Resources successfully!!!');
        bnUtil.disconnect();
    }).catch((error)=>{
        console.log(error);
        bnUtil.disconnect();
    });
}



})


// listen for requests
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});