import * as React from 'react'

const Spotify = (props) => {
    const redirectUri = 'http://localhost:3000/spotify';
    const clientId = '593b17cc2b944d87a80fb302b9ab1f99';

    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    let codeVerifier = localStorage.getItem('code_verifier');

    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier
    });

    const [access_token, setAccesToken] = React.useState(null)

    const getAcessToken = () => {
        fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('HTTP status ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            setAccesToken(data.access_token)
            localStorage.setItem('access_token', data.access_token);

        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const [userData, setUserData] = React.useState(null)
    async function getProfile() {
        let accessToken = localStorage.getItem('access_token');
      
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });
      
        const data = await response.json();
        setUserData(data)
        console.log({data})
    }

    async function refreshToken() {
        let accessToken = localStorage.getItem('access_token');
        const body = new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: accessToken,
            client_id: clientId
        })
      
        const response = await fetch('https://accounts.spotify.com/api/token', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          body: body
        });
      
        const refreshTokenData = await response.json();
        console.log({refreshTokenData})
    }

    const [playlist, setPlayList] = React.useState('')
    const handlePlayListSelect = (event) => {
        const link = event.target.value
        setPlayList(link.split('?')[0].split('/')[4])
    }

    const [playListTrack, setPlayListTrack] = React.useState(null)

    async function getPlaylist() {
        let accessToken = localStorage.getItem('access_token');
      
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist}`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        });
      
        const playListData = await response.json();
        const {tracks: {items}} = playListData

        const listTracks = items.map((item) => {
            const { track: {artists, name: songName} } = item
            const {name: artistName} = artists[0]
            return {songName, artistName}
        })
        setPlayListTrack(listTracks)

        console.log({listTracks})
    }

    return (
        <div>
            <button onClick={getAcessToken}>Get access_token</button>
            <h2>Spotify application</h2>
            <p>{access_token}</p>
            <button onClick={getProfile}>Get profile data</button>
            <button onClick={refreshToken}>Refresh token</button>
            <div>
                <label htmlFor="fname">First name:</label>
                <input type="text" id="fname" name="fname" onChange={(e) => handlePlayListSelect(e)} />
                <button onClick={getPlaylist}>Get playlist</button>
            </div>
        </div>
    )
}

export default Spotify;