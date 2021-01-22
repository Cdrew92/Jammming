import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    searchResults: [],
    playlistName: 'New Playlist',
    playlistTracks: [],
    loading: false,
    savedSearch: ''
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.storeSearch = this.storeSearch.bind(this);
  }

  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
    const savedSearchTerm = localStorage.getItem('savedSearchTerm');
    if (savedSearchTerm) {
      this.setState({
        savedSearch: savedSearchTerm,
      })
    }
    const savedPlaylist = localStorage.getItem('savedPlaylist');
    let parsedSavedPlaylist = JSON.parse(savedPlaylist)
    let playlistArray = [];
    for(var i in parsedSavedPlaylist) {
      playlistArray.push(parsedSavedPlaylist[i]);
    }
    let flattenedPlaylistArray = playlistArray.flat();
        if (flattenedPlaylistArray.length > 0) {
      this.setState({
        playlistTracks: flattenedPlaylistArray,
      })
    }
  }

  componentDidUpdate() {
    let removeDuplicates = this.state.searchResults.filter(duplicate => !this.state.playlistTracks.includes(duplicate));
    if (this.state.searchResults.length == removeDuplicates.length){
      return;
    }
    this.setState({ searchResults: removeDuplicates })
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
        return;
    }
    tracks.push(track);
    console.log(`add track: ${tracks}`)
    this.setState({playlistTracks: tracks})
    localStorage.setItem('savedPlaylist', JSON.stringify({playlistTracks: tracks}));
  }

  removeTrack(track) {
    this.setState({playlistTracks : this.state.playlistTracks.filter(playlistTracks => playlistTracks.id !== track.id)})
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name })
  }

  savePlaylist() {
    if (!this.state.loading) {
      this.setState({ loading: true })
    }
    const trackUris = this.state.playlistTracks.map(playlistTracks => playlistTracks.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
        loading: false,
        savedSearch: ''
      })
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => { 
      this.setState({
      searchResults: searchResults})
    });
  }

  storeSearch(savedSearchTerm) {
    this.setState({
      savedSearch: savedSearchTerm,
    });
    localStorage.setItem('savedSearchTerm', savedSearchTerm);
  }

  render() {
    return (
      <div>
  <div style={{display: this.state.loading ? 'block' : 'none'}} id="overlay"></div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar 
      onSearch={this.search}
      storeSearch = {this.storeSearch}
      applySavedSearch={this.state.savedSearch}
    />
    <div className="App-playlist">
      <SearchResults 
        isRemoval={false} 
        onAdd={this.addTrack} 
        searchResults={this.state.searchResults}
      />

      <Playlist 
        onNameChange={this.updatePlaylistName} 
        onRemove={this.removeTrack} 
        playlistName={this.state.searchResults} 
        playlistTracks={this.state.playlistTracks}
        onSave={this.savePlaylist}
        loading={this.state.loading}
      />
    </div>
  </div>
</div>
    )
  }
}

export default App;
