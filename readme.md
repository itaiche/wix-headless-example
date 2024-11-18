Headless Example
----------------

To run this project:
* Install node JS version 
```js
npm run dev
```

This example is written in native JS for the whole flow.  
It has no dependencies and no fancy code, it just tries to show and log the flow visibly.  

If you want to test this on your site, you need to:   
* update the <a href="src/js//consts.js">consts files</a> to your configuration  
* make sure you updated your headless site to support the URLs in the consts (<a href="src//images/headless settings.png">example 
config</a>)

What this code does as it loads:    
1. Open the <a href="src/index.html">index.html</a> file 
2. Check for a visitor refresh token in localstorage 
3. Call Wix APIs to create an access token from it if it exists
4. If it doesn't exist, create a new visitor with a refresh and access token and store them in local storage  

When clicking the button:  
1. Take the refresh token from the local storage
2. Call the Wix API to create a redirect login session with the local <a href="src/callback.html">callback.html page</a>
3. Render a link to go to login and focus it