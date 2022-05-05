import React from 'react'
import './MyTable.css'
import { useEffect, useState } from 'react';
import {Row,Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const axios = require('axios').default;

export default function MyTable() {
  const [proposals, setProposals] = useState([])
  const [currentBlock, setCurrentBlock] = useState(-1)
  const [proposalData, setProposalData] = useState([])

  const colors = {
    'Ongoing':'white',
    'Unknown':'white',
    'Failed':'#ef5176',
    'Passed':'#7ee6a2'
  }

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
          const proposals = response.data.map((d)=>{
            const obj = JSON.parse(atob(d.MSG))
            const status = Math.random()
            const out_status = proposalData.filter((r)=>r.proposal_id==d.EVENT_ATTRIBUTES.proposal_id)[0]?.result
            if(d.EVENT_ATTRIBUTES.proposal_end_height<=currentBlock){
              if(proposalData && out_status){
                obj.status =  out_status[0].toUpperCase()+out_status.slice(1).toLowerCase()
              }else{
                obj.status = 'Unknown'
              }
            }else{
              obj.status = 'Ongoing'
            }
            obj.proposal_id = d.EVENT_ATTRIBUTES.proposal_id
            obj.proposal_end_height = d.EVENT_ATTRIBUTES.proposal_end_height
            return obj
          })
          setProposals(proposals)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[currentBlock, proposalData])

  useEffect(()=>{
    axios.get("https://lcd.terra.dev/blocks/latest")
    .then(function (response) {
      console.log('Current block: ', response.data.block.header.height)
      setCurrentBlock(response.data.block.header.height)
    })
    .catch(function (error) {
        console.log(error);
    })
  },[])

  return (
    <div className='table-container'>
    <TableContainer component={Paper} style={{height: '100%', background:'transparent'}}>
      <Table sx={{ minWidth: 650, 'th': { border: 0 }}} size="small" aria-label="a dense table">
        <TableHead style={{position: "sticky", top: "0"}}>
          <TableRow style={{backgroundColor:'#000e37'}}>
            {['Proposal','Title', 'Status'].map((h)=>{
              return (<TableCell style={{color:'white', fontWeight: "bold"}}align="center">{h}</TableCell>)
            })}
            </TableRow>
        </TableHead>
        <TableBody>
          {proposals.sort((row1,row2)=>row2.proposal_id-row1.proposal_id).map((row) => (
            <TableRow
              key={row.proposal_id}
              sx={{ 'td': { border: 0 } }}
              style={{backgroundColor:'#000e37', color:'white !important'}}
            >
              <TableCell component="th" scope="row"
              style={{ color:'white', width:'100px'}} align="center">
                {row.proposal_id}
              </TableCell>
              <TableCell style={{width:'200px', padding:'6px 0px'}} align="center"> 
                <a style={{color:'#ada3ff'}} 
                  href={'https://app.astroport.fi/governance/proposal/'+row.proposal_id}
                  target={"_blank"}>
                  {row.submit_proposal.title}
                </a></TableCell>
              <TableCell style={{color: colors[row.status], width:'100px'}} align="center">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
