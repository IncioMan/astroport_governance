import './Proposal.css';
import 'chart.js/auto';
import VotesOverTime from '../VotesOverTime/VotesOverTime.js'
import VotesAddressDistribution from '../VotesAddressDistribution/VotesAddressDistribution';
import ProposalNumberUsers from '../ProposalNumberUsers/ProposalNumberUsers';
import { useState, useEffect } from 'react';
const axios = require('axios').default;

/**
 * 
against: "against"
delta: 47034475958419
for: "for"
proposal_id: 1
result: "passed"
voting_power_against: 10611808811
voting_power_for: 47045087767230
 */

export default function Proposal() {
  const [proposalTitle  ,setProposalTitle] = useState()
  const [proposalId, setProposalId] = useState(1)
  const [proposalData, setProposalData] = useState([])

  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/proposal_recap")
        .then(function (response) {
          setProposalData(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[])

  useEffect(()=>{
    axios.get("https://api.flipsidecrypto.com/api/v2/queries/5de91b84-2450-4b47-b24b-20614e5dc38e/data/latest")
    .then(function (response) {
      const proposals = response.data
      .filter((p)=>p.EVENT_ATTRIBUTES.proposal_id===proposalId)
      .map((d)=>{
        const obj = JSON.parse(atob(d.MSG))
        setProposalTitle(obj.submit_proposal.title)
      })
    })
    .catch(function (error) {
        console.log(error);
    })
  },[proposalId])
  
  return (
      <>
        <div className='proposal-selector-container'>
            <select className='proposal-selector' id="proposal_id" onChange={(e)=>setProposalId(e.target.options.selectedIndex+1)}>
              {
                proposalData.map((p)=>{
                  return <option value={p.proposal_id}>Proposal #{p.proposal_id}</option>
                })
              }
            </select>
          </div>
          {proposalTitle}
          <ProposalNumberUsers proposalId={proposalId}/>
          <div className='charts-container'>
              <VotesOverTime proposalId={proposalId}/>
              <VotesAddressDistribution proposalId={proposalId}/>
          </div>
      </>
  );
}