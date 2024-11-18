/**
 * Generates a code challenge for using PKCE in oAuth2 flows (https://datatracker.ietf.org/doc/html/rfc7636#section-4.2) 
 * @param  codeVerifier - A random string containing 
 * @returns string - encoded code challenge based on the codeVerifier 
 */
export async function generateCodeChallenge(codeVerifier) {
    var digest = await crypto.subtle.digest("SHA-256",
      new TextEncoder().encode(codeVerifier));
  
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
  
/**
 * Creates a random string that alos complies with Code Verifier requiremens of PKCE (https://datatracker.ietf.org/doc/html/rfc7636#section-4.1)
 * as long as the length * passed is in the range of 43-128
 * @param {*} length - the length of the random string to generate
 * @returns string - random string in length specified
 */
export function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}