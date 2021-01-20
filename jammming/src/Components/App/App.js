import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import TrackList from '../TrackList/TrackList';



class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    searchResults: [{name: 'name1', artist: 'artist1', album: 'album1', id:1},
      {name: 'name1', artist: 'artist1', album: 'album1', id:2}],
    playlistName: 'new',
    playlistTracks: [{name: 'name1', artist: 'artist1', album: 'album1', id:1},
      {name: 'name1', artist: 'artist1', album: 'album1', id:2}],
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
        return;
    }
    tracks.push(track);
    this.setState({playlistTrack: tracks})
  }

  removeTrack(track) {
    this.setState({playlistTracks : this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)})
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name })
  }
  
  render() {
    return (
      <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar />
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
      />
    </div>
  </div>
</div>
    )
  }
}

export default App;
