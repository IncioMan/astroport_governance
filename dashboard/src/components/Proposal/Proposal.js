import './Proposal.css';
import 'chart.js/auto';
import VotesOverTime from '../VotesOverTime/VotesOverTime.js'
import VotesAddressDistribution from '../VotesAddressDistribution/VotesAddressDistribution';
import ProposalNumberUsers from '../ProposalNumberUsers/ProposalNumberUsers';
import ProposalMetrics from '../ProposalMetrics/ProposalMetrics';
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
  const [proposalId, setProposalId] = useState(parseInt(initProposalId))

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
  
  const handleProposalSelection = (proposal_id) =>{
    window.location.href = "proposal?id="+proposal_id;
  }
  
  return <>
        {
          !proposalId && 
          <div className='proposal-selector-container'>
            <select className='proposal-selector' id="proposal_id" 
                    onChange={(e)=>handleProposalSelection(e.target.options.selectedIndex+1)}>
              {proposalData.map((p)=>{
                return <option value={p.proposal_id}>Proposal #{p.proposal_id}</option>
              })}
            </select>
          </div>
        }
        {
          proposalId &&
          <>
          <div className='proposal-selector-container'>
          <div className='proposal-title'>
          </div>
          <a style={{color:'#ada3ff'}} 
                  href={'https://app.astroport.fi/governance/proposal/'+proposalId}
                  target={"_blank"}>
          {proposalTitle}</a></div>
          <ProposalMetrics proposalId={proposalId}/>
          <ProposalNumberUsers proposalId={proposalId}/>
          <div className='charts-container'>
              <VotesOverTime proposalId={proposalId}/>
              <VotesAddressDistribution proposalId={proposalId}/>
              <div className='chart-container'>
                <div style={{ width: "35%", minWidth: "250px"}}>
                  <div className='chart-title'>Single Voters Distribution</div>
                  <div className='chart-desc'>
                  A detailed distribution of the amount of governance power of the 
                  single voters in this proposal is depicted in the following chart.
                  We can inspect the chart to ask the question: how many addresses were
                  needed to reach the X% of voting power? What percentage did the top X addresses
                  have?
                  </div>
                </div>
                <div style={{ width: "2%"}}></div>
                <div style={{ width: "63%", minWidth: "250px"}}>
                  <TopVotersPerProposal iProposalsId={[proposalId]} randomFactor={0.00001}></TopVotersPerProposal>
                </div> 
              </div>
          </div>
          </>
        }
        </>
  }