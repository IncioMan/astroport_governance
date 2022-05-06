import './Proposal.css';
import 'chart.js/auto';
import VotesOverTime from '../VotesOverTime/VotesOverTime.js'
import VotesAddressDistribution from '../VotesAddressDistribution/VotesAddressDistribution';
import { useState } from 'react';
const axios = require('axios').default;



export default function Proposal() {
  const [proposalId, setProposalId] = useState(1)
  
  return (
      <>
        <div className='proposal-selector-container'>
            <div className='proposal-selector-line'></div>
            <select className='proposal-selector' id="proposal_id" onChange={(e)=>setProposalId(e.target.options.selectedIndex+1)}>
              <option value={1}>Proposal #1</option>
              <option value={2}>Proposal #2</option>
              <option value={3}>Proposal #3</option>
              <option value={4}>Proposal #4</option>
              <option value={5}>Proposal #5</option>
              <option value={6}>Proposal #6</option>
              <option value={5}>Proposal #7</option>
              <option value={6}>Proposal #8</option>
            </select>
            <div className='proposal-selector-line'></div>
          </div>
          <div className='charts-container'>
              <VotesOverTime proposalId={proposalId}/>
              <VotesAddressDistribution proposalId={proposalId}/>
          </div>
      </>
  );
}