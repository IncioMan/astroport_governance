import './App.css';
import 'chart.js/auto';
import MajorityPerVote from './components/MajorityPerVote/MajorityPerVote'
import VotesOverTime from './components/VotesOverTime/VotesOverTime.js'
import ProposalRecap from './components/ProposalRecap/ProposalRecap.js'
import ProposalResults from './components/ProposalResults/ProposalResults';
import VotesAddressDistribution from './components/VotesAddressDistribution/VotesAddressDistribution';
import { useState } from 'react';
import TopVotersPerProposal2 from './components/TopVotersPerProposal2/TopVotersPerProposal2';
const axios = require('axios').default;



export default function App() {
  const [proposalId, setProposalId] = useState(1)
  
  return (
    <div className='App'>
        <div className='App-header'>
          <a className='title-container' href={"https://lbp.neb.money/"}>
            <img src={"https://raw.githubusercontent.com/IncioMan/astroport_governance/master/images/logo.svg"}/>
            <div className='title'>Governance Dashboard</div>
          </a>
          <div className='charts-container'>
            <ProposalRecap/>
            <TopVotersPerProposal2 topRange={2}/>
        </div>
        <div className='charts-container'>
            <MajorityPerVote/>
            <ProposalResults/>
        </div>
        <div className='proposal-selector-container'>
          <div className='proposal-selector-line'></div>
          <select className='proposal-selector' id="proposal_id" onChange={(e)=>setProposalId(e.target.options.selectedIndex+1)}>
            <option value={1}>Proposal #1</option>
            <option value={2}>Proposal #2</option>
            <option value={3}>Proposal #3</option>
            <option value={4}>Proposal #4</option>
            <option value={5}>Proposal #5</option>
            <option value={6}>Proposal #6</option>
          </select>
          <div className='proposal-selector-line'></div>
        </div>
        <div className='charts-container'>
            <VotesOverTime proposalId={proposalId}/>
            <VotesAddressDistribution proposalId={proposalId}/>
        </div>
      </div>
    </div>
  );
}