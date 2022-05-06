import './App.css';
import 'chart.js/auto';
import MajorityPerVote from './components/MajorityPerVote/MajorityPerVote'
import VotesOverTime from './components/VotesOverTime/VotesOverTime.js'
import ProposalRecap from './components/ProposalRecap/ProposalRecap.js'
import ProposalResults from './components/ProposalResults/ProposalResults';
import TableProposals from './components/TableProposals/TableProposals';
import VotesAddressDistribution from './components/VotesAddressDistribution/VotesAddressDistribution';
import { useState } from 'react';
import TopVotersPerProposal2 from './components/TopVotersPerProposal/TopVotersPerProposal';
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
          <Overview/>
          <Proposal/>
        </div>
      </div>
  );
}