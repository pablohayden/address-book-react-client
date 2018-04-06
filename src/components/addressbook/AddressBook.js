import React from 'react';
import BpkSmallArrowUpIcon from 'bpk-component-icon/sm/arrow-up';
import BpkButtonLink from 'bpk-component-link';
import BpkCard from 'bpk-component-card';
import BpkInput, { INPUT_TYPES, CLEAR_BUTTON_MODES } from 'bpk-component-input';
import BpkCheckbox from 'bpk-component-checkbox';

import BpkLabel from 'bpk-component-label';
import BpkSmallArrowDownIcon from 'bpk-component-icon/sm/arrow-down';
import {
	BpkTable,
	BpkTableHead,
	BpkTableBody,
	BpkTableRow,
	BpkTableCell,
	BpkTableHeadCell,
  } from 'bpk-component-table';

import styles from './AddressBook.scss';
 
const c = className => styles[className] || 'UNKNOWN';

const endpointurl = "http://localhost:8080/addressbook"

class AddressBookComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {contactlist: [], original: [], sortedstate: "unsorted", filtertype: ""};
		this.updateContactList = this.updateContactList.bind(this);
		this.setSortedState = this.setSortedState.bind(this);	
		this.setFilterType = this.setFilterType.bind(this);
		this.remoteFilter = this.remoteFilter.bind(this);

		
	}

	componentDidMount() {

        fetch(endpointurl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response.json();
          })
          .then((data) => {
           
            // console.log("data: "  + JSON.stringify(data.contacts));
            this.setState({contactlist: data.contacts});
            this.setState({original: data.contacts});
           
          })
          .catch((error) => {
            console.log(error);
          });
    
	}

	remoteFilter(filterstr) {

		console.log("remote filtering go...");

		fetch(endpointurl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({name: filterstr, phone: '', address: ''})
        })
          .then((response) => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
            return response.json();
          })
          .then((data) => {
           
            // console.log("data: "  + JSON.stringify(data.contacts));
            this.setState({contactlist: data.contacts});
            this.setState({original: data.contacts});
           
          })
          .catch((error) => {
            console.log(error);
          });
    
	}


	
	updateContactList(contacts){
		this.setState({contactlist: contacts});
	}
	
	setSortedState(state){
			this.setState({sortedstate: state});
	}

	setFilterType(type){
		console.log("filter: " +  type);
		this.setState({filtertype: type});
	}

	render() {
		return (
			<AddressBook  filtertypecallback={this.setFilterType} remotefiltercallback={this.remoteFilter} filtertype={this.state.filtertype} sortcallback={this.setSortedState} sortedstate={this.state.sortedstate} originalcontactlist={this.state.original}  contactlist={this.state.contactlist} callback={this.updateContactList}/>
		)
	}
}

// tag::App

// tag::addressbook[]
class AddressBook extends React.Component{
	
	constructor(props) {
		super(props);
		this.state = {filtervalue:''};
		 this.filterChanged=this.filterChanged.bind(this);
		 this.filterByName=this.filterByName.bind(this);
		 this.filterTypeChanged=this.filterTypeChanged.bind(this);
		 this.sortByName=this.sortByName.bind(this);
		 this.sortByPhone=this.sortByPhone.bind(this);
		 this.sortByAddress=this.sortByAddress.bind(this);
	}

	filterChanged(event) {
		this.setState({filtervalue: event.target.value});
	}

	  
	filterTypeChanged(event){

		if(event.target.checked == true){
			this.props.filtertypecallback("local");
		}
		else{
			this.props.filtertypecallback("remote");
		}
		
	}

	sortByName(contacts){

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
			
			if(this.props.filtertype=="local"){
				var filtercontacts = this.props.originalcontactlist.filter(function (contact) {
					var patt = new RegExp(event.target.value);
					var res = patt.test(contact.name);
				if(res == true) return contact
				});

				this.props.callback(filtercontacts);
			}
			else{
				console.log("Remote filtering");
				this.props.remotefiltercallback(event.target.value);
			}
		}
     }
     
	render() {
		var contacts = this.props.contactlist.map(contactx =>
			<Contact key={contactx.name} contact={contactx}/>
		);
		
		return (
				
				
			<BpkCard className={c('address-book')} >


			<div>

				<BpkLabel htmlFor="filter">Filter</BpkLabel>
				

				 <BpkInput
					id="filter"
					type={INPUT_TYPES.TEXT}
					name="filter"
					value={this.state.filtervalue}
					onChange={this.filterChanged} 
					onKeyUp={this.filterByName}
					placeholder="Filter by contact name..."
					/>
				<BpkLabel htmlFor="networkfilter">Local filtering enabled</BpkLabel>

				<BpkCheckbox className={c('network-check-filter')} 
					name="networkfilters"
					id="networkfilter" label=""
					onChange={this.filterTypeChanged}
				/>
			</div>
			
			<BpkTable>
				<BpkTableHead>
					<BpkTableRow>
						<BpkTableHeadCell   onClick={this.sortByPhone}>Name {(this.props.sortedstate == "unsorted" || this.props.sortedstate != "sortbynameasc") ? <BpkSmallArrowUpIcon/>:<BpkSmallArrowDownIcon/>}</BpkTableHeadCell>
						<BpkTableHeadCell  onClick={this.sortByPhone}>Phone Number {(this.props.sortedstate == "unsorted" || this.props.sortedstate != "sortbyphoneasc") ? <BpkSmallArrowUpIcon/>:<BpkSmallArrowDownIcon/>}</BpkTableHeadCell>
						<BpkTableHeadCell onClick={this.sortByAddress}>Address {(this.props.sortedstate == "unsorted" || this.props.sortedstate != "sortbyaddressasc") ? <BpkSmallArrowUpIcon/>:<BpkSmallArrowDownIcon/>}</BpkTableHeadCell>
					</BpkTableRow>
				</BpkTableHead>
				<BpkTableBody>
					{contacts}     
				</BpkTableBody>
	 		</BpkTable>
			 </BpkCard>
					)
	}
}
// end::addressbook[]

// tag::contact[]
class Contact extends React.Component{
	render() {
		return (
			<BpkTableRow>
			<BpkTableCell>{this.props.contact.name}</BpkTableCell>
			<BpkTableCell>{this.props.contact.phone_number}</BpkTableCell>
			<BpkTableCell>{this.props.contact.address}</BpkTableCell>			
		  	</BpkTableRow>
		)
	}
}
// end::contact[]


export default AddressBookComponent;
