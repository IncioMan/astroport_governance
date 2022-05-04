import React from 'react'
import './MyTable.css'
import { useEffect, useState } from 'react';
const axios = require('axios').default;

function MyTable() {
  const [proposals, setProposals] = useState([])
  
  useEffect(()=>{
    axios.get("https://api.flipsidecrypto.com/api/v2/queries/5de91b84-2450-4b47-b24b-20614e5dc38e/data/latest")
        .then(function (response) {
          console.log("habemus data2", response.data)
          const proposals = response.data.map((d)=>{
            const obj = JSON.parse(atob(d.MSG))
            console.log(d.EVENT_ATTRIBUTES.proposal_id)
            obj.proposal_id = d.EVENT_ATTRIBUTES.proposal_id
            return obj
          })
          setProposals(proposals)
          console.log(proposals)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[])
  
  return (
  <div className='table-container'>
  <table className='table-my' >
  <thead>
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Start</th>
      <th>End</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
    {proposals.map((p)=>{
    return <tr>
      <td>{p.proposal_id}</td>
      <td>
        <a style={{color:'#ada3ff'}} href={'https://app.astroport.fi/governance/proposal/'+p.proposal_id}
         target={"_blank"}>
          {p.submit_proposal.title}
        </a>
      </td>
      <td>11/Apr/22 15:22 UTC</td>
      <td>15/Apr/22 15:22 UTC</td>
      <td>Passed</td>
    </tr>
    })}
  </tbody>
</table>
</div>
  )
}

export default MyTable