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
          display: true,
          text: 'ciao',
          color: '#ffffff'
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
        legend:{
          display: true,
          position: 'right'
        },
        title: {
          display: true,
          text: 'BLLLALALALALA',
          color: '#ffffff'
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
        <div className='pie-chart-title'>Number of Voters</div>
        <div className='chart-desc'>
          Not all proposals get voted through. Let's plot 
          how many proposals have passed/failed out of all the ones
          put up for vote. Have the majority of proposals passed?  
        </div>
      </div>
      <div className='doughnuts-container'>
        { (chartNVoterData.data)&&
          <div className='doughnut-container'>
          <Doughnut  options={chartNVoterData.options} data={chartNVoterData.data}/>
          </div>
        }
        { (chartVotPowrData.data)&&
          <div className='doughnut-container'>
          <Doughnut  options={chartVotPowrData.options} data={chartVotPowrData.data}/>
          </div>
        }
      </div>
    </div>
  );
}