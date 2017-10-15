import React from 'react';
import ReactDOM from 'react-dom';
import Search from './search';
import Wishlist from './wishlist';

class App extends React.Component {
	constructor(){
		super();
		this.state= {
			pictures: [],
			query:""
		}
		 this.handleSearch = this.handleSearch.bind(this);
		 this.AddToWish = this.AddToWish.bind(this);
	}

	AddToWish(src){
		//debugger;
		var id = src.currentTarget.id;
		var div=document.getElementById("div"+id);
		div.className="exists";
		var albumid=div.getAttribute("data-albumid");

		if (typeof(Storage) !== "undefined") {
			var key = 'albumid'+albumid;
    		localStorage.setItem(key, albumid);
    		var searchKeys=localStorage.getItem("searchKeys");
    		if(typeof(searchKeys) == "undefined" || searchKeys == null){

    		 searchKeys=albumid;
    		}else{
    			if(searchKeys.indexOf(albumid) == -1){
    				searchKeys=searchKeys + ","+ albumid;
    			}
    		}
    		localStorage.setItem("searchKeys",searchKeys);
		} else {
		    // Sorry! No Web Storage support..
		}
	}

	handleSearch(search){
		//alert("called from child");
		this.state.query=search;
		this.getData(search)
		.then(data => {
			let pictures = data.results.map((album) => {
				var didExists = false;
				var key = 'albumid'+album.collectionId;
				var itemId = localStorage.getItem(key);
				var classNameOf = "notExists";
				var btnValue = "Add to playlist";
				if (typeof (itemId) != "undifined" && itemId != null){
					didExists = true;
					classNameOf = "exists";
					btnValue = "Already in playlist";
				}
				return (
					<div key={"key"+album.trackId} id={"div"+album.trackId} className={`item ${classNameOf}`} data-albumid={album.collectionId}>
						<img alt="img" src={album.artworkUrl100.replace('100x100', '1200x1200')} />
						<br />
						<div className="infoBox">
							<span className="artName">{album.artistName}</span>
							<span className="trackName">{album.trackName}</span>
							<input type="button" className="wishBtn" onClick={this.AddToWish} id={album.trackId} value={btnValue} />
						</div>
					</div>
				)
			})
			this.setState({pictures : pictures});
			//console.log("state", this.state.pictures);
		})
		
	}

	getAPIURL(search){ 	
		var temp='https://itunes.apple.com/search?media=music&term=@query';
		var uri= search || '';
		uri=temp.replace('@query',search)
		return uri;
	}

	getData(search){
		var url=this.getAPIURL(search);
		return new Promise(function(resolve,reject){
		fetch(url)
			.then(function(results){
			
			 resolve(results.json());
			},function(error){
				reject("error")
			});
		});

	}

	render() {
		return(
			<div className="container1">
				<Search  parenteventref={this.handleSearch}/>
				<div className="container2">
					{this.state.pictures}
					<div className="clearfix"></div>
				</div>
				<Wishlist />
			</div>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
)

export default App;