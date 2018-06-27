'use strict';

 module.exports = {
    cardStore : require('composer-common').FileSystemCardStore,
    BusinessNetworkConnection : require('composer-client').BusinessNetworkConnection,
    cardName : "publicUser@pivot-test123",
   
    // Holds the Business Network Connection
    connection: {},

    // 1. This is the function that is called by the app
    connect : function(callback) {


        //const cardStore = new this.cardStore();
        //this.connection = new this.BusinessNetworkConnection({ cardStore: cardStore });
        var cardType = { type: 'composer-wallet-filesystem' }
        this.connection = new this.BusinessNetworkConnection(cardType);

        // Invoke connect
        return this.connection.connect(this.cardName).then(function(){
            callback();
            console.log('Ping responmse ')

        }).catch((error)=>{
            callback(error);
            console.log('Ping responmse ', error)

        });
    },

    // 2. Disconnects the bn connection
    disconnect : function(callback) {
        this.connection.disconnect();
    },

    // 3. Pings the network
    ping : function(callback){
        return this.connection.ping().then((response)=>{
            callback(response);
            console.log('Ping responmse ', response)
        }).catch((error)=>{
            console.log('Ping responmse ', error)

            callback({}, error);
        });
    }
 }




