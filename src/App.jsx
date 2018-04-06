
import React, { Component } from 'react';
import { BpkCode } from 'bpk-component-code';
import BpkButton from 'bpk-component-button';
import BpkText from 'bpk-component-text';
import { BpkGridContainer, BpkGridRow, BpkGridColumn } from 'bpk-component-grid';


import AddressBookPanel from './components/addressbook';

import STYLES from './App.scss';

const c = className => STYLES[className] || 'UNKNOWN';

const App = () => (
  <div className={c('App')}>
    <header className={c('App__header')}>
      <BpkGridContainer>
        <BpkGridRow>
          <BpkGridColumn width={12}>
            <BpkText tagName="h1" textStyle="xl" className={c('App__heading')}>Simple Address Book Example</BpkText>
            <BpkText tagName="h1" textStyle="base" className={c('App__heading')}>React Front End integrated with a seperate Spring REST API</BpkText>
          </BpkGridColumn>
        </BpkGridRow>
      </BpkGridContainer>
    </header>
    <main className={c('App__main')}>
      <BpkGridContainer>
        <BpkGridRow>
          <BpkGridColumn width={12}>
              <AddressBookPanel/>
           </BpkGridColumn>
        </BpkGridRow>
      </BpkGridContainer>
    </main>
  </div>
);

export default App;
