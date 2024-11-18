
import { log } from './log.js';
/**
 * DOCS: https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-visitors#generate-new-visitor-tokens
 *  This methods gets the access token and refresh token for a new visitor 
 * Params:
 clientId - the headless clientId 
DOCS: https://dev.wix.com/docs/go-headless/getting-started/setup/authentication/create-an-oauth-app-for-visitors-and-members
*  Expected response:
* {  // The access token for making API calls
    'access_token': 'string', 
    // The type of token
    'token_type': 'Bearer',
    // How many seconds before this token expires
    'expires_in': 14400,
    // A token to get new access tokens for this visitor
    'refresh_token': 'string'
}
**/
export async function getVisitorTokens(clientId){
    const url = 'https://www.wixapis.com/oauth2/token';
    const body = JSON.stringify({
        clientId,
        grantType: 'anonymous'
    });
    const headers = {
        'Content-Type': 'application/json'
    };
    log(`calling ${url} with 
        body: ${body}
        headers: ${JSON.stringify(headers, null, 4)}`);
    const response = await fetch(url, { headers ,body, method: 'post' });
    log(`Response headers: ${getReponseHeadersString(response.headers).headersString}`);
    return await response.json();
}
/**
 * DOC: https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-visitors#renew-visitor-tokens
 * This function asks for new visitor access and refresh tokens 
 * when provided with an exisitng access token 
 * Expected response:
     {  // The access token for making API calls
        'access_token': 'string', 
        // The type of token
        'token_type': 'Bearer',
        // How many seconds before this token expires
        'expires_in': 14400,
        // A token to get new access tokens for this visitor
        'refresh_token': 'string'
    }
    **/
export async function refresAccessTokens(refreshToken){
    const url = 'https://www.wixapis.com/oauth2/token';
    const body = JSON.stringify({
        refresh_token: refreshToken,
        grantType: 'refresh_token'
    });
    const headers = {
        'Content-Type': 'application/json'
    };
    log(`calling ${url} with 
        body: ${body}
        headers: ${JSON.stringify(headers, null, 4)}`);
    const response = await fetch(url, { headers, body, method: 'post' });
    log(`Response headers: ${getReponseHeadersString(response.headers).headersString}`);
    return await response.json();
}
/**
 * DOCS: https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-members-with-wix-managed-login#login-request
 * This is the call to make before redirecting to get the login URL for redirection
 * After 
 * params:
     redirectUri: There redirect URI to your login callback. The redirectUri must be an allowed authorization redirect URI.
    clientId: Your OAuth app client ID for headless.
    codeChallenge: PKCE code challenge that you generated
    state: A state parameter that you generated
    * Expected Reponse:
    {
        redirectSession: {
            id: string,
            fullUrl: URL
        }
    }
**/
export async function getLoginUrl(clientId, accessToken, redirectUri, codeChallenge, state) {
    const url = 'https://www.wixapis.com/_api/redirects-api/v1/redirect-session';
    const body = JSON.stringify({
        auth: { 
            authRequest: {
                redirectUri,
                clientId,
                codeChallenge,
                codeChallengeMethod: 'S256',
                responseMode: 'fragment',
                responseType: 'code',
                scope: 'offline_access',
                state
            },
            prompt: 'none'
        }
    }); 
    const headers = {
        'authorization': accessToken,
        'Content-Type': 'application/json'
    };
    log(`calling ${url} with 
        body: ${body}
        headers: ${JSON.stringify(headers, null, 4)}`);
    const response = await fetch(url, { headers, body, method: 'post' });
    log(`Response headers: ${getReponseHeadersString(response.headers).headersString}`);
    return await response.json();
}
/**
 * DOCS: https://dev.wix.com/docs/go-headless/coding/rest-api/visitors-and-members/handle-members-with-wix-managed-login#login-callback
 * This method should be called in the page specified as the callback page
 * It is a post login process page which should now get the access tokens
 * Params:
    clientId: The client ID of the OAuth app your project is using.
    redirectUri: The same URI passed when calling the Redirect Session endpoint. The redirectUri must be an allowed authorization redirect URI.
    code: The code you retrieved from the URL fragment.
    codeVerifier: The code verifier you retrieved from local storage. 
* Expected response:
    {
    'access_token': 'string',
    'token_type': 'Bearer',
    'expires_in': 14400,
    'refresh_token': 'string'
    } 
    **/
export async function getPostLoginTokens(clientId, redirectUri, code, codeVerifier){
    const url = 'https://www.wixapis.com/oauth2/token';
    const body = JSON.stringify({
                        grantType: 'authorization_code',
                        clientId,
                        redirectUri,
                        code,
                        codeVerifier
                    }); 
    const headers = {
        'Content-Type': 'application/json'
    };
    log(`calling ${url} with 
        body: ${body}
        headers: ${JSON.stringify(headers, null, 4)}`);
    const response = await fetch(url, { headers, body, method: 'post' });
    log(`Response headers: ${getReponseHeadersString(response.headers).headersString}`);
    return await response.json();
}

function getReponseHeadersString(headers){
    const resHeaders = {};
    headers.forEach((value, key) => {
        resHeaders[key] = value;
    });
    return {
        resHeaders,
        headersString: JSON.stringify(resHeaders, null, 4)
    };
}