import { log, error } from './log.js';
import { createRandomString, generateCodeChallenge } from './PKCE.js';

const CLIENT_ID = 'clientId';
const VISITOR_ACCESS_TOKEN = 'visitoAccessToken';
const VISITOR_REFRESH_TOKEN = 'visitoRefreshToken';
const MEMBER_ACCESS_TOKEN = 'memberAccessToken';
const MEMBER_REFRESH_TOKEN = 'memberRefreshToken'
const CODEVERIFIER = 'codeVerifer';
const STATE = 'state';

export const storage = {
    getClientId,
    setClientId,
    setMemberAccessToken,
    getValidMemberAccessToken,
    getMemberRefreshToken,
    setMemberRefreshToken,
    setVisitorAccessToken,
    getValidVisitorAccessToken,
    setVisitorRefreshToken,
    getVisitorRefreshToken
};

function getClientId(){
   return getItem(CLIENT_ID, 'Getting client Id from local storage');
}
 
function setClientId(clientId){
   log('Setting client Id to local storage');
   return setItem(CLIENT_ID, clientId);
}

function setMemberAccessToken(accessToken, expires){
    log('setting Member access token and expiry to local storage');
    const expiry = new Date(Date.now() + (expires * 1000)).getTime();
    return setItem(MEMBER_ACCESS_TOKEN, JSON.stringify({ accessToken, expiry }));
}

function getValidMemberAccessToken(){
    log('getting visitor access token from local storage (if it is still valid)');
    const atString = localStorage.getItem(MEMBER_ACCESS_TOKEN); 
    const { accessToken, expiry } = atString && JSON.parse(atString) ||  null;
    if(expiry && expiry > Date.now()) {
        return accessToken;
    } else {
     return null;
    }
}

function setMemberRefreshToken(token){
   log('Setting member refresh token to local storage');
   return setItem(MEMBER_REFRESH_TOKEN, token);  
}

function getMemberRefreshToken(){
    return getItem(MEMBER_REFRESH_TOKEN, 'Getting member refresh token from local storage');
 }

function setVisitorRefreshToken(refreshToken){
    log('Setting visitor refresh token to local storage');
    return setItem(VISITOR_REFRESH_TOKEN, refreshToken);
}

function getVisitorRefreshToken(){
    return getItem(VISITOR_REFRESH_TOKEN, 'getting visitor refresh token from local storage');
}

function setVisitorAccessToken(accessToken, expires){
    log('setting visitor access token and expiry to local storage');
    // This computes the actual expiry date 
    const expiry = new Date(Date.now() + (expires * 1000)).getTime();
    return setItem(VISITOR_ACCESS_TOKEN, JSON.stringify({ accessToken, expiry }));
}

export function getValidVisitorAccessToken(){
    log('getting visitor access token from local storage (if it is still valid)');
    const atString = localStorage.getItem(VISITOR_ACCESS_TOKEN); 
    const { accessToken, expiry } = atString && JSON.parse(atString) ||  null;
    if(expiry && expiry > Date.now()) {
        return accessToken;
    } else {
     return null;
    }
}

/**
 * This method creates the code challenge and code verifier 
 * using the PKCE file and stores the last code verifier for later usage 
 * Since it use the utils it has to be async
 * @returns 
 */
export async function createAndStoreCodeChallenge(){ 
    log('Creating code challenge');
    const codeVerifier = createRandomString(63);    
    log(`Created code challenge verifier ${codeVerifier}`);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    log(`Created code challenge ${codeChallenge}`)
    setItem(CODEVERIFIER, codeVerifier);
    log(`Code challenge: ${codeChallenge}, and Code Verifier for callback: ${codeVerifier}`);
    return codeChallenge;
}

export function getCodeVerifier(){
    return getItem(CODEVERIFIER,'Getting Code Verifier form local storage');
}

export function getState(){
    return getItem(STATE, 'Getting State form local storage');
}
/**
 * This function creates and stores the state for the client to verify  
 * on the response from the oAuth2 IDP server (https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1)
 * as recommended by the spec 
 * @returns 
 */
export function createAndStoreState(){
    log('Creating State for call to login');
    const stateChallenge = createRandomString(20);
    setItem(STATE, stateChallenge);
    log(`State ${stateChallenge}`);
    return stateChallenge;
}

function getItem(key, logText) {
    const item = localStorage.getItem(key) || null;
    item ? log(`${logText} : ${item}`) : error(`Failed to get key ${key}`) ;
    return item;   
}

function setItem(key, value){
    if(value !== undefined) {
        localStorage.setItem(key, value);
    }
}