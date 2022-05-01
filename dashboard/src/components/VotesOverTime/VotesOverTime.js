import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
const axios = require('axios').default;


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.defaults.color = "#fff";
ChartJS.defaults.backgroundColor = "#fff";
ChartJS.defaults.borderColor = "#fff";

export default function VotesOverTime() {
  const [rawData, setRawData] = useState([])
  const [chartData, setChartData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/votes_over_time")
        .then(function (response) {
          setRawData(response.data)
          console.log("habemus data3", response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[])

  useEffect(()=>{
    if(rawData.length == 0){
      return
    }

    const proposal_id = 1

    const data = {
      labels: [...new Set(rawData.map((i, p)=> p))],
      datasets: [{
          label: 'For',
          data:
          rawData.filter((d)=>d.proposal_id==proposal_id).map((d)=>
          {
            let datapoint = {}
            datapoint.x = (0.1 - 0.2*Math.random()) + d.proposal_id
            datapoint.y = (Math.random())*1000 + Math.round(d.voting_power/1000000/100)*100
            datapoint.voter = d.voter
            datapoint.proposal_id = d.proposal_id
            return d.voting_power_for_cumsum
          }),
          backgroundColor: '#7fe6a2'
        },
        {
          label: 'Against',
          data:
          rawData.filter((d)=>d.proposal_id==proposal_id).map((d)=>
          {
            let datapoint = {}
            datapoint.x = (0.1 - 0.2*Math.random()) + d.proposal_id
            datapoint.y = (Math.random())*1000 + Math.round(d.voting_power/1000000/100)*100
            datapoint.voter = d.voter
            datapoint.proposal_id = d.proposal_id
            return d.voting_power_against_cumsum
          }),
          backgroundColor: '#ef5176'
        }
      ],
    }

    console.log('ciao',[...new Set(rawData.map((i, p)=> p))])
    const options = {
      responsive: true,
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

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  }
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
    console.log(chartData.options, chartData.data)
    console.log(options, data)
    return <Line options={chartData.options} data={chartData.data} />;
}