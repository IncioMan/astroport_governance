import './App.css';
import 'chart.js/auto';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react';
import Overview from './components/Overview/Overview';
import Proposal from './components/Proposal/Proposal';
const axios = require('axios').default;



export default function App() {
  const [proposalId, setProposalId] = useState(1)
  
  return (
      <div className='App'>
        <div className='App-header'>
          <div className='title-banner'>
            <a className='title-container' href={"https://app.astroport.fi/governance"}>
              <img src={"https://raw.githubusercontent.com/IncioMan/astroport_governance/master/images/logo.svg"}/>
              <div className='title'>Governance Dashboard</div>
            </a>
            <div className='title-bar'></div>
          </div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/proposal" element={<Proposal />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
  );
}