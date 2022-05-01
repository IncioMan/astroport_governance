import logo from './logo.svg';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { ArcElement } from "chart.js";
import 'chart.js/auto';
import { useEffect, useState } from 'react';
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
ChartJS.defaults.borderColor = "#fff";




export default function App() {
  const [proposalData, setProposalData] = useState([])
  const [proposalChartData, setProposalChartData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/proposal_recap")
        .then(function (response) {
          setProposalData(response.data)
          console.log("habemus data")
        })
        .catch(function (error) {
            console.log(error);
        })
  },[])

  useEffect(()=>{
    if(proposalData.length == 0){
      return
    }
    const labels = [1,2,3,4,5,6,7];
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
          }
        },
        y: {
          stacked: true
        },
      },
    };
    const data = {
      labels,
      datasets: [
        {
          label: 'Against',
          data: labels.map((i) => proposalData.filter((p)=>parseInt(p.proposal_id)==i).map((p)=>p.voting_power_against)),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'For',
          data: labels.map((i) => proposalData.filter((p)=>parseInt(p.proposal_id)==i).map((p)=>p.voting_power_for)),
          backgroundColor: 'rgb(75, 192, 192)',
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
    console.log(proposalChartData, proposalData)
  },[proposalData])
  

  return (
    <div className='App'>
        <div className='App-header'>
          <div className='charts-container'>
            <div className='chart-container'>
              { (proposalChartData.data)&&
                <Bar options={proposalChartData.options} data={proposalChartData.data}/>
              }
            </div>
            <div className='chart-container'>
              { (proposalChartData.data)&&
                <Bar options={proposalChartData.options} data={proposalChartData.data}/>
              }
            </div>
        </div>
      </div>
    </div>
  );
}