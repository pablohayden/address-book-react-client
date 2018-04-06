
import React, { Component } from 'react';
import FlightPanel from './components/flightnav';
import ControlNav from './components/controlnav';
import SearchNav from './components/searchnav';
import MiddleNav from './components/middlenav';
import BpkSmallMenuIcon from 'bpk-component-icon/sm/menu';
import BpkButton from 'bpk-component-button';
import BpkText from 'bpk-component-text';
import BpkLink, { BpkButtonLink } from 'bpk-component-link';
import { BpkGridContainer, BpkGridRow, BpkGridColumn } from 'bpk-component-grid';

import styles from './ScannerApp.scss';
import format from 'date-fns/format';

const endpointurl = "http://localhost:4000/api/search"

// const data = require('./data/results.json');

const c = className => styles[className] || 'UNKNOWN';

class ScannerApp extends Component {

  constructor(props) {
    super(props);
    /** Bind our functions to events */
    this.displayResults = this.displayResults.bind(this);
    this.displaySearchPanel = this.displaySearchPanel.bind(this);
    this.displaySearchingPanel = this.displaySearchingPanel.bind(this);
    this.updateResultsList = this.updateResultsList.bind(this);
    this.state = {
      resultsList: [],
      isResultPanelOpen: false,
      isSearchPanelOpen: true,
      isMessagePanelOpen: false,
      isSearchingPanelOpen: false,
      searchOutcomeMessage: "No message right now",
      toPlace: "undefined",
      fromPlace: "undefined",
      class: "Economy",
      adults: 1,
    };
  }

  search = (data) => {

    if (data.class.length < 1
      || data.fromPlace.length < 1
      || data.fromDate.length < 1
      || data.toPlace.length < 1
      || data.toDate.length < 1) {
      // console.log("All fields must be completed... ");
      this.displayMessagePanel("All fields must be completed...");
    } else {

      this.displaySearchingPanel();


      this.setState({ toPlace: data.toPlace, fromPlace: data.fromPlace, adults: data.adults, class: data.class });

      var jsonbody = {
        "adults": data.adults,
        "class": data.class,
        "toPlace": data.toPlace,
        "toDate": data.toDate,
        "fromPlace": data.fromPlace,
        "fromDate": data.fromDate
      };

      fetch(endpointurl, {
        method: 'POST',
        body: JSON.stringify(jsonbody),
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
          this.displayResults();
          this.updateResultsList(data);
        })
        .catch((error) => {
          console.log(error);
          this.displayMessagePanel("We've hit a problem. Check if the server is up and try again...");
        });
    }
  }

  updateResultsList = (data) => {

    /** Set of maps to easily look up key values */
    var segmensmap = new Map(data.Segments.map((segment) => [segment.Id, segment]));
    var legmap = new Map(data.Legs.map((leg) => [leg.Id, leg]));
    var carriermap = new Map(data.Carriers.map((carrier) => [carrier.Id, carrier]));
    var agentmap = new Map(data.Agents.map((agent) => [agent.Id, agent]));
    var placemap = new Map(data.Places.map((place) => [place.Id, place]));
    var currencymap = new Map(data.Currencies.map((currency) => [currency.Code, currency]));
    var carriermap = new Map(data.Carriers.map((carrier) => [carrier.Id, carrier]));
    var currencySymbol = currencymap.get(data.Query.Currency).Symbol;


    var flights = [];

    data.Itineraries.map(itin => {

      var outboundleg = legmap.get(itin.OutboundLegId);
      var outboundstops = (outboundleg.Stops.length > 0) ? (outboundleg.Stops.length + "stop") : "direct";
      var inboundleg = legmap.get(itin.InboundLegId);
      var inboundstops = (inboundleg.Stops.length > 0) ? (inboundleg.Stops.length + "stop") : "direct";

      var outboundDepartureTime = format(outboundleg.Departure, 'HH:mm');
      var outboundArrivalTime = format(outboundleg.Arrival, 'HH:mm');

      var inboundDepartureTime = format(inboundleg.Departure, 'HH:mm');
      var inboundArrivalTime = format(inboundleg.Arrival, 'HH:mm');

      /** Just pick the first one. As we're not going to support multiple carriers at this stage */
      var outboundcarrier = carriermap.get(outboundleg.Carriers[0]);
      var inboundcarrier = carriermap.get(inboundleg.Carriers[0]);

      var outboundcarrierimg = outboundcarrier.ImageUrl;
      var inboundcarrierimg = inboundcarrier.ImageUrl;

      var formattime = (time => {
        console.log("time: " + time);
        if (time > 60) {
          console.log("greater than an hours");
          var hours = (time / 60) >> 0;
          var minutes = time - (hours * 60);
          return hours + "h " + minutes + "m";
        } else {
          return time + "m"
        }
      });

      var outboundduration = formattime(outboundleg.Duration);
      var inboundduration = formattime(inboundleg.Duration);
      var outboundoriginplace = placemap.get(outboundleg.OriginStation);
      var outbounddestinationplace = placemap.get(outboundleg.DestinationStation);
      var inboundoriginplace = placemap.get(inboundleg.OriginStation);
      var inbounddestinationplace = placemap.get(inboundleg.DestinationStation);

      itin.PricingOptions.map(priceoption => {

        var agentname = agentmap.get(priceoption.Agents[0]).Name;

        var jsonitinary = {
          "OutboundLeg": {
            "OriginPlace": outboundoriginplace.Name,
            "DestinationPlace": outbounddestinationplace.Name,
            "DepartTime": outboundDepartureTime,
            "ArrivalTime": outboundArrivalTime,
            "TravelStages": outboundstops,
            "TravelTime": outboundduration,
            "CarrierIcon": outboundcarrierimg,
          },
          "InboundLeg": {
            "OriginPlace": inboundoriginplace.Name,
            "DestinationPlace": inbounddestinationplace.Name,
            "DepartTime": inboundDepartureTime,
            "ArrivalTime": inboundDepartureTime,
            "TravelStages": inboundstops,
            "TravelTime": inboundduration,
            "CarrierIcon": inboundcarrierimg
          },
          "BookingAgent": agentname,
          "BookingPrice": priceoption.Price,
          "BookingCurrency": currencySymbol
        }

        var flightpanel = <FlightPanel itinerary={jsonitinary} />

        flights.push(flightpanel);
      });
    });


    this.setState({ resultsList: flights });

    this.displayResults();
  }

  displayResults = (event) => {
    this.setState({ isResultPanelOpen: true, isSearchPanelOpen: false, isMessagePanelOpen: false, isSearchingPanelOpen: false });
  }

  displaySearchingPanel = (event) => {
    this.setState({ isResultPanelOpen: false, isMessagePanelOpen: false, isSearchingPanelOpen: true });
  }

  displayMessagePanel = (newmessage) => {
    console.log("displaying message panel");

    console.log("Finished...");
    this.setState({ isMessagePanelOpen: true, isSearchPanelOpen: true, searchOutcomeMessage: newmessage, isResultPanelOpen: false, isSearchingPanelOpen: false });
  }

  displaySearchPanel(event) {
    console.log("display search panel");
    this.setState({ isResultPanelOpen: false, isSearchPanelOpen: true, isMessagePanelOpen: false, isSearchingPanelOpen: false });
  }

  render() {
    return (

      <div className="App">
        <header className={c('header')}>
          <div>
            <div className={c('scanner-icon')} />
            <BpkLink href="http://www.skyscanner.net/" className={c('scanner-title')}>skyscanner</BpkLink>
          </div>
          <div>
            <BpkSmallMenuIcon className={c('icon-blue')} onClick={this.displaySearchPanel} onMouseOver={this.onEnter} />
          </div>
        </header>


        <div className={this.state.isResultPanelOpen == true ? c('resultcontainer') : c('hidden')}>

          <MiddleNav originPlace={this.state.toPlace}
            destinationPlace={this.state.fromPlace}
            numTravellers={this.state.adults}
            cabinClass={this.state.class} />
          <ControlNav />
          <BpkGridContainer>
            <BpkGridRow>
              <BpkGridColumn width={12}>
                {this.state.resultsList}
              </BpkGridColumn>
            </BpkGridRow>
          </BpkGridContainer>
        </div>
        <div id="searchpanel" className={this.state.isSearchPanelOpen == true ? c('search-container') : c('hidden')}>

          <SearchNav searchCallback={this.search}
            isMessagePanelOpen={this.state.isMessagePanelOpen}
            isSearchingPanelOpen={this.state.isSearchingPanelOpen} searchOutcomeMessage={this.state.searchOutcomeMessage} />

        </div>
      </div>
    );
  }
}


export default ScannerApp;
