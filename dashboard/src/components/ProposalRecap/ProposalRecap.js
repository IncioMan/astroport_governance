import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import './ProposalRecap.css'
const axios = require('axios').default;


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.color = "#fff";
ChartJS.defaults.backgroundColor = "#fff";

export default function ProposalRecap() {
  const [proposalData, setProposalData] = useState([])
  const [proposalChartData, setProposalChartData] = useState({options:null, data:null})
  
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
    if(proposalData.length == 0){
      return
    }
    const labels = [...new Set(proposalData.map((p)=>p.proposal_id))];
    const options = {
      plugins: {
        title: {
          display: false,
          text: 'Chart.js Bar Chart - Stacked',
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          grid:{
            display: false
          },
          title: {
            display: true,
            text: 'Proposals'
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, ticks) {
                return '#' + (parseInt(value) +1);
            }
        }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Governance Power'
          },
        },
      },
    };
    const data = {
      labels,
      datasets: [
        {
          label: 'Against',
          data: labels.map((i) => proposalData.filter((p)=>parseInt(p.proposal_id)==i).map((p)=>Math.round(p.voting_power_against/100000000/100)*100)),
          backgroundColor: '#ef5176',
        },
        {
          label: 'For',
          data: labels.map((i) => proposalData.filter((p)=>parseInt(p.proposal_id)==i).map((p)=>p.voting_power_for/100000000/100)*100),
          backgroundColor: '#7fe6a2',
        },
        {
          label: 'Abstain',
          data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
          backgroundColor: 'rgb(223, 223, 222)',
        },
      ],
    }
    setProposalChartData({
      options: options,
      data: data
    })
    //console.log(proposalChartData, proposalData)
  },[proposalData])
  

  return (
    <div className='chart-container'>
      <div style={{ width: "35%", minWidth: "250px"}}>
        <div className='chart-title'>Total Votes Distribution</div>
        <div className='chart-desc'>
          Each proposal is put up for a vote and the community
          can cast a vote according to the amount of voting power
          they have from their ASTRO holdings. Let's plot the results
          from each proposal. Have most of the proposals passed? With what
          ratio of for/against votes? Which have been the most controversial proposals?
        </div>
      </div>
      <div style={{ width: "2%"}}></div>
      <div style={{ width: "63%", minWidth: "250px"}}>
        { (proposalChartData.data)&&
          <Bar options={proposalChartData.options} data={proposalChartData.data}/>
        }
      </div>
    </div>
  );
}