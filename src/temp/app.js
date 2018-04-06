import React from 'react';

// const React = require('react');
// const ReactDOM = require('react-dom');
// const client = require('./client');

class AddressBookComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {contactlist: [], original: [], sortedstate: "unsorted"};
		this.updateContactList = this.updateContactList.bind(this);
		this.setSortedState = this.setSortedState.bind(this);	
	}

	componentDidMount() {
		// client({method: 'GET', path: '/addressbook'}).done(response => {
		// 	this.setState({contactlist: response.entity.contacts});
		// 	this.setState({original: response.entity.contacts});
		// });
	}
	
	updateContactList(contacts){
		this.setState({contactlist: contacts});
	}
	
	setSortedState(state){
			this.setState({sortedstate: state});
	}
	
	render() {
		return (
			<AddressBook  sortcallback={this.setSortedState} sortedstate={this.state.sortedstate} originalcontactlist={this.state.original}  contactlist={this.state.contactlist} callback={this.updateContactList}/>
		)
	}
}

// tag::App

// tag::addressbook[]
class AddressBook extends React.Component{
	
	constructor(props) {
		super(props);
		 this.filterByName=this.filterByName.bind(this);
		 this.sortByName=this.sortByName.bind(this);
		 this.sortByPhone=this.sortByPhone.bind(this);
		 this.sortByAddress=this.sortByAddress.bind(this);
	}

	sortByName(contacts){

		console.log("Sort: " + this.props.contactlist);
			
			var sortedcontacts;
			
			if(this.props.sortedstate == "sortbynameasc"){
				sortedcontacts = this.props.contactlist.reverse();

				this.props.sortcallback("sortbynamedesc");
			}else{
				sortedcontacts = this.props.contactlist.sort((a, b) => a.name.localeCompare(b.name));
				this.props.sortcallback("sortbynameasc");
			}

			
			this.props.callback(sortedcontacts);
			
		}
	
	sortByPhone(contacts){
			
		console.log("Sort: " + this.props.contactlist);
		
		var sortedcontacts;
		
		if(this.props.sortedstate == "sortbyphoneasc"){
			sortedcontacts = this.props.contactlist.reverse();

			this.props.sortcallback("sortbyphonedesc");
		}else{
			sortedcontacts = this.props.contactlist.sort((a, b) => a.phone_number.localeCompare(b.phone_number));
			this.props.sortcallback("sortbyphoneasc");
		}

		
		this.props.callback(sortedcontacts);
		
		}
	sortByAddress(contacts){
		
	console.log("Sort: " + this.props.contactlist);
		
		var sortedcontacts;
		
		if(this.props.sortedstate == "sortbyaddressasc"){
			sortedcontacts = this.props.contactlist.reverse();

			this.props.sortcallback("sortbyaddressdesc");
		}else{
			sortedcontacts = this.props.contactlist.sort((a, b) => a.address.localeCompare(b.address));
			this.props.sortcallback("sortbyaddressasc");
		}

		
		this.props.callback(sortedcontacts);
		
		
		}
	
	filterByName(event) {
		
		if(event.keyCode == 13){
			
			var filtercontacts = this.props.originalcontactlist.filter(function (contact) {
				var patt = new RegExp(event.target.value);
			    var res = patt.test(contact.name);
			   if(res == true) return contact
			});
			
			this.props.callback(filtercontacts);
		}
		 
     }
     
	render() {
		var contacts = this.props.contactlist.map(contactx =>
			<Contact key={contactx.name} contact={contactx}/>
		);
		
		return (
				
			<div>
			<div>
			  <label>filter</label>
			<input type="text" id="filter" onKeyUp={this.filterByName}></input>
			</div>
			<table>
				<tbody>
					<tr>
						<th>Name Jon</th>
						<th>Phone Number</th>
						<th>Address</th>
					</tr>
					<tr>
					<th><a href="#" onClick={this.sortByName}>{(this.props.sortedstate == "unsorted" || this.props.sortedstate != "sortbynameasc") ? "sort asc":"sort dec"}</a></th>
					<th><a href="#" onClick={this.sortByPhone}>{(this.props.sortedstate == "unsorted" || this.props.sortedstate != "sortbyphoneasc") ? "sort asc":"sort dec"}</a></th>
					<th><a href="#" onClick={this.sortByAddress}>{(this.props.sortedstate == "unsorted" || this.props.sortedstate != "sortbyaddressasc") ? "sort asc":"sort dec"}</a></th>
				</tr>
					{contacts}
				</tbody>
			</table>
			</div>
		)
	}
}
// end::addressbook[]

// tag::contact[]
class Contact extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.contact.name}</td>
				<td>{this.props.contact.phone_number}</td>
				<td>{this.props.contact.address}</td>
			</tr>
		)
	}
}


// end::contact[]

// // tag::render[]
// ReactDOM.render(
// 	<App />,
// 	document.getElementById('react')
// )
// // end::render[]


export default AddressBookComponent;
