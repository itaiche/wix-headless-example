Wix Headless Example
----------------
This example is written in pure JS for:
* Visitor session creation and refresh using Wix headless app on a domain that is not the Wix site 
* Wix Headless Member login flow using redirects to the Wix site 

This project is coded using [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) to skip any build / bundling code to mix in with the logic. 
It has no dependencies and no fancy code, it tries to show the flow using logs.

## Running locally
To run this project:  
* clone this project  
* [Install node JS](https://nodejs.org/en/download/package-manager) *version 18* and up  
* enter the folder you cloned this in  
* run `npm run dev`  
* Test site is now available on [http://localhost:3000/index.html](http://localhost:3000/index.html)  

> If your are using node version manager you can also use `nvm install` to get the correct Node version in the project

## Project Code
### JS Files  

* [consts.js](src/js/consts.js) - contains all the configuration you created in your [headless app on your Wix site](https://dev.wix.com/docs/go-headless/getting-started/setup/authentication/create-an-oauth-app-for-visitors-and-members)    
* [oAuth.js](src//js//oAuth.js) - has all the [API calls we will be using](https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-visitors)  
* [PKCE.js](src/js/PKCE.js) - has all the logic for creating a [code challenge and code verifier](https://datatracker.ietf.org/doc/html/rfc7636#section-4.2) for the login flow   
* [utilities.js](src//js/utilities.js) - handles all the storing of data in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and exposes sugar syntax APIs for getting and setting data   
* [log.js](src/js/log.js) - writes the logs to the UI   
* [server.mjs](src/server.mjs) - serves the files locally using NodeJS  

### HTML Files

* [index.html](src//index.html) - [creates a visitor session](https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-visitors#generate-new-visitor-tokens) or [refreshes an existing one]( https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-visitors#renew-visitor-tokens), getting access and refresh tokens in both cases.  
  *  Clicking on the button creates up a [login redirect session on Wix](https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-members-with-wix-managed-login#login-request).  
  * When the link appears, clicking on it will take you to login on the Wix site.   
* [callback.html](src/callback.html) - Gets the data after the visitor has logged in on the Wix site and [gets the access tokens and refresh tokens](https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-members-with-wix-managed-login#login-callback) after the login    

## Testing your own site
If you want to test this on your site, you need to:   
* update the <a href="src/js//consts.js">consts files</a> to your [Headless App configuration](https://dev.wix.com/docs/go-headless/getting-started/setup/authentication/create-an-oauth-app-for-visitors-and-members)
* make sure you updated your headless site to support the URLs in the consts (<a href="src//images/headless settings.png">example 
config</a>)

### Code Flow index.html
What this code does as it loads:    
1. Renders the <a href="src/index.html">index.html</a> file 
2. Check for a visitor refresh token in localstorage 
3. Call Wix APIs to create an access token from it if it exists
4. If it doesn't exist, create a new visitor with a refresh and access token and store them in local storage  

When clicking the button:  
1. Take the refresh token from the local storage
2. Call the Wix API to create a redirect login session with the local <a href="src/callback.html">callback.html page</a>
3. Render a link to go to login and focus it

When you click the link you will be redirected to login on the Wix site.  
After you complete the login flow, you will be redirected to the local callback page. 

### Code Flow callback.html
1. Checks for the [hash](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash) containing the `code` and `state` data 
2. If the data doesn't exist it will redirect to the `index.html`
3. If it does, the page will call Wix to complete the flow and get member access and refresh tokens 