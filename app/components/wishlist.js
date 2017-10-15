import React from 'react';
import ReactDOM from 'react-dom';

class WishList extends React.Component{
	constructor(props){
		//debugger;
		super(props);
		//this.state.pictures=[];
		this.state= {
			pictures: [],
			interval: null,
			apiretval:[],
			value:""
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.removeFav = this.removeFav.bind(this);
		this.closePlist = this.closePlist.bind(this);
	}

	handleChange(event) {
    this.setState({value: event.target.value});
    this.state.value=event.target.value;
    if(event.target.value == ""){
    	this.loadData(this);
    	this.initInterval();
    }
    if(event.target.value.length > 0){
    	this.searchArray();

    }
  }

  closePlist(){
  	var wlistDiv = document.getElementById("wishlistCon");
    wlistDiv.style.display = "none";
  }

  removeFav(src){
  		clearInterval(this.state.interval);
		var id = src.currentTarget.id;
		var div=document.getElementById("div"+id);
		
		var albumid=div.getAttribute("data-albumid");
		var dbkey="albumid"+albumid;
		localStorage.removeItem(dbkey);
		var seachkeys=localStorage.getItem("searchKeys");
		var albums=seachkeys.split(',');
		seachkeys="";
		for(var a=0; a < albums.length; a++){
			if(albums[a] != albumid){
				if(seachkeys == ""){
					seachkeys=albums[a];
				}else{
					seachkeys=seachkeys+","+albums[a];
				}
			}

		}
		this.setState({pictures : []});
		localStorage.setItem("searchKeys",seachkeys);
		this.loadData(this);
		this.initInterval();


  }

  searchArray(){
  	//debugger;
   clearInterval(this.state.interval);
	var pictures=[];
	this.state.pictures=[];
			for (var i = 0; i<this.state.apiretval.length ;  i++) {
				var record=this.state.apiretval[i];
				var didExists = false;
				//var key = 'albumid'+record.collectionId;
				//var itemId = localStorage.getItem(key);
				//if (typeof (itemId) != "undifined" && itemId != null){
				//	didExists = true;
				//	}

				if(record.artistName.toUpperCase().indexOf(this.state.value.toUpperCase()) >= 0) {

					didExists=true;
				}

				if(didExists){
				var display= <div key={record.collectionId} data-albumid={record.collectionId} className="wlist-item" id={"div"+record.collectionId}>
								<img alt="img" src={record.artworkUrl100} />
								<div className="wlistDetail">
									<span className="wlName">{record.artistName}</span>
									<span className="wlalbumName">{record.collectionName}</span>
									<span className="wlcntry">{record.country}</span>
								</div>
								<input type="button" className="removeBtn" value="Remove" onClick={this.removeFav} id={record.collectionId} />
							</div>;
				

				pictures.push(display);
			}
		}
		this.setState({pictures : pictures});
		//console.log("state", this.state.pictures);


  }

	handleSubmit(event) {
		debugger;

	this.searchArray();	

    
    event.preventDefault();
  }

	getData(search){

var url=this.createSearchUrl(search);
//debugger;
return new Promise(function(resolve,reject){
fetch(url)
		.then(function(results){
		 resolve(results.json());
		},
		function(error){
			reject(error);
		});

});

 }

	createSearchUrl(search){
	  var temp="https://itunes.apple.com/lookup?id=@query&entity=album";
	  var uri= search || '';
	  uri=temp.replace('@query',search)
	  return uri;
	 }


loadData(that){
	
 var searchkey="";
	//var that=this;
	searchkey=localStorage.getItem("searchKeys");
	//that.setState({pictures : []});
	that.state.apiretval=[];
	if(typeof(searchkey) != "undefined" && searchkey!=null && searchkey.length > 0){
		that.getData(searchkey)
		.then(function(data){
			//debugger;
			
			var pictures=[];
			that.state.apiretval=[];
			for (var i = 0; i<data.results.length ;  i++) {
				var record=data.results[i];
				that.state.apiretval.push(record);
				var didExists = false;
				var key = 'albumid'+record.collectionId;
				var itemId = localStorage.getItem(key);
				if (typeof (itemId) != "undifined" && itemId != null){
					didExists = true;
					}

				if(didExists){
				var display= <div key={record.collectionId} data-albumid={record.collectionId} className="wlist-item" id={"div"+record.collectionId}>
								<img alt="img" src={record.artworkUrl100} />
								<div className="wlistDetail">
									<span className="wlName">{record.artistName}</span>
									<span className="wlalbumName">{record.collectionName}</span>
									<span className="wlcntry">{record.country}</span>
								</div>
								<input type="button" className="removeBtn" value="Remove" onClick={that.removeFav} id={record.collectionId} />
							</div>;
				

				pictures.push(display);
			}
		}
		that.setState({pictures : pictures});
		//console.log("state", that.state.pictures);


		
	},function(error){
			 console.log("error");
		});
		
	}

}

initInterval(){
	var that=this;
		this.state.interval=setInterval(function()
			{
				//debugger;
				that.loadData(that);
			},5000);
}
	componentDidMount(){
		this.initInterval();
		this.loadData(this);
 
	}

	render(){
		return (
			<div className="wishlist-con" id="wishlistCon">
				<a href="#" id="closePlist" onClick={this.closePlist}></a>
				<div className="wlist-search">
					<input type="text" placeholder="search playlist" className="genTxt plist" value={this.state.value} onChange={this.handleChange} />
				</div>
				<div className="playlistWrapper">
					{this.state.pictures}
					<div className="clearfix"></div>
				</div>
			</div>
		)
	}
}

// ReactDOM.render(
// 	<WishList />,
// 	document.getElementById('app')
// )

export default WishList;