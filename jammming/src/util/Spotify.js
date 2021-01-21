const clientId = "631cff8bc3774a539eb31b67ea05f6c9";
const redirectUri = "http://localhost:3000";

let accessToken;

const Spotify = {

    // Gets access token from Spotify
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        }
        const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
        if (hasAccessToken && hasExpiresIn) {
            accessToken = hasAccessToken[1];
            const expiresIn = Number(hasExpiresIn[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    // Uses access token to return a response from the Spoitify API using user serach term from SearchBar
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then( response => { 
            return response.json();     
        }).then(
            jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
            }));
        });
    },

    // Gets a user's ID from Spotify, creates a new playlist on user's account, and adds tracks to that playlist
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;

        // Return user's ID from Spotify API
        return fetch('https://api.spotify.com/v1/me', {
            headers: headers}
        ).then(
            response => response.json()
        ).then(jsonResponse => {
                userId = jsonResponse.id;

                // Adds playlist to user's account
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({name: name})
                }).then(response => response.json()
                ).then(jsonResponse => {
                        const playlistId = jsonResponse.id;

                        // Adds tracks to new playlist 
                        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackUris})
                        });
                    });
            })
    }
}

export default Spotify;