import React from 'react';
import ReactDOM from 'react-dom';
import type { HeaderState } from './utils';


class Search extends React.Component{
   constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showPllist = this.showPllist.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  showPllist() {
    var wlistDiv = document.getElementById("wishlistCon");
    wlistDiv.style.display = "block";
  }

  handleSubmit(event) {
    this.props.parenteventref(this.state.value);
    //pass this value to parent component
    event.preventDefault();
  }

	render(){
		return (
			<div className="searchBar">
        <input type="text" placeholder="Search" className="genTxt" value={this.state.value} onKeyUp={this.handleSubmit} onChange={this.handleChange} />  
        <input type="button" value="Search" className="genBtn" onClick={this.handleSubmit} />
        <a href="#" className="playlistView" onClick={this.showPllist}>View Playlist</a>
			</div>
		)
	}
}

ReactDOM.render(
	<Search />,
	document.getElementById('app')
)

export default Search;