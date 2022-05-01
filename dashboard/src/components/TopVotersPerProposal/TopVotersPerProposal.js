import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
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

export default function TopVotersPerProposal() {
  const [rawData, setRawData] = useState([])
  const [chartData, setChartData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/top_voters_per_proposal")
        .then(function (response) {
          setRawData(response.data)
          console.log("habemus data2", response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[])

  useEffect(()=>{
    if(rawData.length == 0){
      return
    }

    const data = {
      datasets: [{
          label: 'For',
          data:
          rawData.filter((d)=>d.vote=='for').map((d)=>
          {
            let datapoint = {}
            datapoint.x = d.proposal_id
            datapoint.y = d.voting_power
            return datapoint
          }),
          backgroundColor: '#7fe6a2'
        },
        {
          label: 'Against',
          data:
          rawData.filter((d)=>d.vote=='against').map((d)=>
          {
            let datapoint = {}
            datapoint.x = d.proposal_id
            datapoint.y = d.voting_power
            return datapoint
          }),
          backgroundColor: '#ef5176'
        }
      ],
  }

  

    const labels = [...new Set(rawData.map((p)=>p.proposal_id))];
    const options = {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          grid:{
            display: false
          }
        },
        y: {
          grid:{
            display: false
          }
        }
      }
    };
    const cd = {
      options: options,
      data: data
    }
    setChartData(cd)
    console.log(chartData, cd)
  },[rawData])
  

  return (
    <div className='chart-container'>
      { (chartData.data)&&
        <Scatter options={chartData.options} data={chartData.data}/>
      }
    </div>
  );
}