import './Proposal.css';
import 'chart.js/auto';
import VotesOverTime from '../VotesOverTime/VotesOverTime.js'
import VotesAddressDistribution from '../VotesAddressDistribution/VotesAddressDistribution';
import ProposalNumberUsers from '../ProposalNumberUsers/ProposalNumberUsers';
import { useState, useEffect } from 'react';
import TopVotersPerProposal from '../TopVotersPerProposal/TopVotersPerProposal';
import { useLocation } from 'react-router-dom';
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
  const [proposalData, setProposalData] = useState([])
  const { search } = useLocation();
  const match = search.match(/id=(.*)/);
  const initProposalId = match?.[1];
  const [proposalId, setProposalId] = useState(initProposalId ? parseInt(initProposalId):1)

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
            <div style={{padding: "30px 0px"}}>
              
            </div>
          <div className='proposal-title'>
          </div>
          <a style={{color:'#ada3ff'}} 
                  href={'https://app.astroport.fi/governance/proposal/'+proposalId}
                  target={"_blank"}>
          {proposalTitle}</a></div>
          <ProposalNumberUsers proposalId={proposalId}/>
          <div className='charts-container'>
              <VotesOverTime proposalId={proposalId}/>
              <VotesAddressDistribution proposalId={proposalId}/>
          </div>
          <TopVotersPerProposal proposalId={[proposalId]}></TopVotersPerProposal>
      </>
  );
}