## Introduction

Please use this app to scaffold a Node JS app to make API requests directly to a Shopify store.  

### Features

In this example, this app:

1. Takes two parameters: an object that contains the credentials of a specific store, and an array of customerIds.
2. It checks if each customer at the specified store has "Net Terms" as a tag.  If it does, then no update is made.  If it does not exist, then "Net Terms" added.  

### Setup

After git cloning this project and running `npm install`, you will need to create a .env file that contains the API credentials of your app.  

To generate your credentials:

1. From the shopify admin panel if the store you need access to, click **Apps** > **App and sales channel settings** > **Develop apps** > **Create an app**
    - If you do not see **Develop apps**, you will need to update your Shopify user account's store access.  Please reach out to the Shopify Platform Manager and ask to be granted permission to **Manage and install apps and channels**.
2. Provide a relevant name to your app and then click **Create app**.
3. Click **Configure Admin API scopes** and select the necessary access scopes and then click **save**.  For this example app, the **write_customers** and **read_customers** access was selected.
4. Click on the **API credentials** tab and then click **Install app** > **Install**.  This process also generates your API credentials.  
5. On a secure text file, please record the following:
-  Admin API access token
-  API key
-  API secret key

To setup your app: 

6. In the project folder, refer to the `.env.example` file and create a new `.env` file, and add your credentials like so (this assumes you created your app for the staging website):

```
apiKeyStaging="<API key>" // enter the value without brackets
apiSecretStaging="<API secret key>" // enter the value without brackets
accessTokenStaging="<Admin API access token>" // enter the value without brackets

```
