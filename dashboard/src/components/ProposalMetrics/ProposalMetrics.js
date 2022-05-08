import './ProposalMetrics.css';
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

export default function Proposal(props) {
  const {proposalId} = props
  const [proposalData, setProposalData] = useState([])
  const [rawData, setRawData] = useState([])
  const [nAddr, setNAddr] = useState()
  const [xAstroHolders, setXAstroHolders] = useState([])
  const [astroHolders, setAstroHolders] = useState([])
  const [allHolders, setAllHolders] = useState([])

  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/n_addr")
        .then(function (response) {
          setRawData(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[proposalId])


  useEffect(()=>{
      //xASTRO
    axios.get("https://terra-api.daic.capital/api/tx/GetRichlistByTokenContract?"
              +"apiKey=vAp6ysmAXH470YcphYxv&contract_address=terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7")
        .then(function (response) {
          setXAstroHolders(Object.keys(response.data.result.holders))
        })
        .catch(function (error) {
            console.log(error);
        })
        //ASTRO
    axios.get("https://terra-api.daic.capital/api/tx/GetRichlistByTokenContract?"
        +"apiKey=vAp6ysmAXH470YcphYxv&contract_address=terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3")
      .then(function (response) {
        setAstroHolders(Object.keys(response.data.result.holders))
        console.log(astroHolders.length)
      })
      .catch(function (error) {
          console.log(error);
      })
  },[])

  useEffect(()=>{
    setAllHolders(new Set(xAstroHolders, astroHolders))
  },[xAstroHolders, astroHolders])

  useEffect(()=>{
    setProposalData(rawData.filter((p)=>parseInt(p.proposal_id)==parseInt(proposalId)))
  },[rawData])

  useEffect(()=>{
    //Calculate metrics
    if(proposalData){
      setNAddr(
        (proposalData.filter((p)=>p.vote==='for')[0]?.voter ? proposalData.filter((p)=>p.vote==='for')[0]?.voter : 0) +
        (proposalData.filter((p)=>p.vote==='against')[0]?.voter ? proposalData.filter((p)=>p.vote==='against')[0]?.voter : 0) +
        (proposalData.filter((p)=>p.vote==='abstain')[0]?.voter ? proposalData.filter((p)=>p.vote==='abstain')[0]?.voter : 0)
      )
    }
  },[proposalData])
  
  
  return (
<div className='metrics-container'>    
    <div className='metric-container'>
      <div className='metric-name'>Number of voters</div>
      <div className='metric-value'>{nAddr}</div>
    </div>
    <div className='metric-container'>
      <div className='metric-name'>Number of voters</div>
      <div className='metric-value'>300</div>
    </div>    
</div>
  );
}