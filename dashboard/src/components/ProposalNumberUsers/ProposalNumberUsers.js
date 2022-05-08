import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import './ProposalNumberUsers.css';
const axios = require('axios').default;


ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.color = "#fff";
ChartJS.defaults.backgroundColor = "#fff";

export default function ProposalNumberUsers(props) {
  const {proposalId} = props
  const [proposalTitle, setProposalTitle] = useState([])
  const [rawNVoterData, setRawNVoterData] = useState([])
  const [rawVotPowrData, setRawVotPowrData] = useState([])
  const [chartNVoterData, setChartNVoterData] = useState({options:null, data:null})
  const [chartVotPowrData, setCharVotPowrData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/n_addr")
        .then(function (response) {
          setRawNVoterData(response.data.filter((p)=>p.proposal_id===proposalId))
        })
        .catch(function (error) {
            console.log(error);
        })
    
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/votpwr")
        .then(function (response) {
          setRawVotPowrData(response.data.filter((p)=>p.proposal_id===proposalId))
        })
        .catch(function (error) {
            console.log(error);
        })
  },[proposalId])

  useEffect(()=>{
    if(chartVotPowrData.length == 0){
      return
    }

    const votPowrData = {
      labels: [...new Set(rawVotPowrData.map((p)=>p.vote))],
      datasets: [
        {
          label: '# of Votes',
          data: rawVotPowrData.map((p)=>p.voting_power),
          backgroundColor: [
            '#ef5176',
            '#7fe6a2'
          ],
          borderColor: [
            '#ef5176',
            '#7fe6a2'
          ],
          borderWidth: 1,
        },
      ],
  }

  

    const options = {
      plugins: {
        legend:{
          display: true,
          position: 'right'
        },
        title: {
          display: false
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                let labelProposals = 'Number of proposals: '
                let labelResult='' 
                if (context.raw) {
                    labelResult += 'Result: '+context.label
                    labelProposals += context.raw
                }
                return [label,labelResult, labelProposals];
              }
            }
        }
      },
      responsive: true,
      radius: 110,
    };
    const cd = {
      options: options,
      data: votPowrData
    }
    setCharVotPowrData(cd)
  },[rawVotPowrData])

  useEffect(()=>{
    if(chartNVoterData.length == 0){
      return
    }

    const nVoterData = {
      labels: [...new Set(rawNVoterData.map((p)=>p.vote))],
      datasets: [
        {
          label: '# of Votes',
          data: rawNVoterData.map((p)=>p.voter),
          backgroundColor: [
            '#ef5176',
            '#7fe6a2'
          ],
          borderColor: [
            '#ef5176',
            '#7fe6a2'
          ],
          borderWidth: 1,
        },
      ],
  }

  

    const options = {
      plugins: {
        title: {
          display: false,
        },
        legend:{
          display: true,
          position: 'right'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                let labelProposals = 'Number of proposals: '
                let labelResult='' 
                if (context.raw) {
                    labelResult += 'Result: '+context.label
                    labelProposals += context.raw
                }
                return [label,labelResult, labelProposals];
              }
            }
        }
      },
      responsive: true,
      radius: 110,
    };
    const cd = {
      options: options,
      data: nVoterData
    }
    setChartNVoterData(cd)
  },[rawNVoterData])
  

  return (
    <div className='pie-dchart-container'>
      <div className='chart-title-container'>
        <div className='pie-chart-title'>Vote Overview</div>
        <div className='chart-desc'>
          The distribution of voting power and single number of voters who voted for or against.
          The two metrics can differ and tell different sides of the same story. For example, when 
          the majority of single voters are in favor, but most of the voting power has voted against -
          hence making the proposal fail - it means that some single users has voted with a large share of voting power.
        </div>
      </div>
      <div className='doughnuts-container'>
        { (chartNVoterData.data)&&
          <div className='doughnut-container'>
          <div className='d-title'>Number of Voters</div>
          <Doughnut  options={chartNVoterData.options} data={chartNVoterData.data}/>
          </div>
        }
        { (chartVotPowrData.data)&&
          <div className='doughnut-container'>
          <div className='d-title'>Voting Power</div>
          <Doughnut  options={chartVotPowrData.options} data={chartVotPowrData.data}/>
          </div>
        }
      </div>
    </div>
  );
}