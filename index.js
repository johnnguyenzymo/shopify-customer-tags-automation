import axios from "axios";
import qs from "qs";
import fs from "fs";
import 'dotenv/config';

//NOTE!  This script is to automate the process of adding a new tag to a customer.
// Step 1: Create a .env with the same format as .env.example to pull credentials from.  Make sure the app has access to read and write to customers.
// Step 2: Add all the shopify Ids into customerIdArray on line 97
// Step 3: Pass stageCredentials or prodCredentials as the first argument on line 107
// Step 4: In the terminal, run the command "node index.js" to start the script

const stageCredentials = {
    apiKey: process.env.apiKeyStaging,
    apiSecret: process.env.apiSecretStaging,
    storeName: "zymo-stage",
    accessToken: process.env.accessTokenStaging,
    basicAuth: process.env.basicAuthStaging
}

const prodCredentials = {
    apiKey: process.env.apiKeyProduction,
    apiSecret: process.env.apiSecretProduction,
    storeName: "zymoresearch",
    accessToken: process.env.accessTokenProduction,
    basicAuth: process.env.basicAuthProduction
}


// This function starts the script.  
const getCustomerTags = (credentials, customerId) => {
    const { apiKey, apiSecret, storeName, accessToken, basicAuth } = credentials;
    const config = {
        method: 'get',
        url: `https://${apiKey}:${apiSecret}@${storeName}.myshopify.com/admin/api/2022-04/customers/${customerId}.json`,
        headers: {
            "X-Shopify-Access-Token": `${accessToken}`,
            "Authorization": `Basic ${basicAuth}`
        }
    }

    // It first checks to see if the customer has the tag, "Net Terms". If it doesn't, it will run updateCustomerTags() with "Net Terms" appended to the list of tags.
    axios(config)
        .then(function (response) {
            let customerResponse = JSON.stringify(response.data.customer.tags);
            if (!customerResponse.includes("Net Terms")) {
                fs.appendFileSync("log.txt", `${customerId} get: Customer does not have Net Terms` + "\r\n", function (err) {
                    if (err) throw err;
                })
                let customerTags = `${response.data.customer.tags}, Net Terms`;
                updateCustomerTags(credentials, customerId, customerTags);
            } else {
                fs.appendFileSync("log.txt", `${customerId} get: Customer already has Net Terms` + "\r\n", function (err) {
                    if (err) throw err;
                })
            }
        })
        .catch(function (error) {
            fs.appendFileSync("log.txt", `${customerId} get: ${error}` + "\r\n", function (err) {
                if (err) throw err;
            })
        });
}
//This function adds the tag to the customer. 
const updateCustomerTags = (credentials, customerId, customerTags) => {
    const { apiKey, apiSecret, storeName, accessToken, basicAuth } = credentials;
    let tagsToUpdate = qs.stringify({
        customer: {
            tags: customerTags
        }
    });

    const config = {
        method: 'put',
        url: `https://${apiKey}:${apiSecret}@${storeName}.myshopify.com/admin/api/2022-04/customers/${customerId}.json`,
        headers: {
            "X-Shopify-Access-Token": `${accessToken}`,
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data : tagsToUpdate
      };

    axios(config)
        .then(function (response) {
            fs.appendFileSync("log.txt", `${customerId} put: Customer now has Net Terms` + "\r\n", function (err) {
                if (err) throw err;
            })
        })
        .catch(function (error) {
            fs.appendFileSync("log.txt", `${customerId} put: ${error}` + "\r\n", function (err) {
                if (err) throw err;
            })
        });
};


let customerIdArray = [
    // add customer Shopify Ids here
    ]

// This for loop iterates through the customerIdArray and adds the tag to the customer
for (let i = 0; i < customerIdArray.length; i++) {
    let k = i;
    setTimeout(function() {
        //pass stageCredentials or prodCredentials as the first argument depending on which environment you wish to run this script
        getCustomerTags(prodCredentials, customerIdArray[k]);
    }, 500 * (k + 1));
}