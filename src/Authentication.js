import * as React from 'react';

const Authentication = (props) => {
    function generateRandomString(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    async function generateCodeChallenge(codeVerifier) {
        function base64encode(string) {
          return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        }
      
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
      
        return base64encode(digest);
    }

    const clientId = '593b17cc2b944d87a80fb302b9ab1f99';
    const redirectUri = 'http://localhost:3000/spotify';

    let codeVerifier = generateRandomString(128);

    const handleAuthClick = () => {
        generateCodeChallenge(codeVerifier).then(codeChallenge => {
            let state = generateRandomString(16);
            let scope = 'user-read-private user-read-email';
    
            localStorage.setItem('code_verifier', codeVerifier);
    
            let args = new URLSearchParams({
                response_type: 'code',
                client_id: clientId,
                scope: scope,
                redirect_uri: redirectUri,
                state: state,
                code_challenge_method: 'S256',
                code_challenge: codeChallenge
            });
    
            window.location = 'https://accounts.spotify.com/authorize?' + args;
        });
    }
      
    return (
        <button onClick={handleAuthClick}>
            Authentication
        </button>
    )
}

export default Authentication