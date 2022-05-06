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

export default function VotesAddressDistribution(props) {
  const [rawData, setRawData] = useState([])
  const [chartData, setChartData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/majority_per_vote")
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

    const data = {
      labels: [...rawData.map((p)=> p.proposal_id)],
      datasets: [{
          label: '',
          data:
          rawData.map((d)=>
          {
            return d.n_for_majority
          }),
          fill: false,
          borderColor: '#ef5176',
          tension: 0.1
        }
      ],
    }
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: false,
        },
      },
      elements: {
        point:{
          borderWidth: 0,
          radius: 0
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
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
                return '#' + (parseInt(value));
            }
          }
        },
        y: {
          grid:{
            display: false
          },
          title: {
            display: true,
            text: 'Min n° of addresses to reach majority'
          },
          max: 10,
          min: 0
        }
      },
    };
    
    const cd = {
      options: options,
      data: data
    }
    setChartData(cd)
    console.log(chartData, cd)
  },[rawData])

    console.log(chartData.options, chartData.data)
    return (
      <div className='chart-container'>
      <div className='chart-title'>Addresses holding the Majority of Voting Power</div>
      <div className='chart-desc'>
        In each proposal, what is the minimum amount
        of addresses which were needed to reach majority?
        The higher this number is, the more decentralized the governance power is.
        Has this value been increasing or decreasing over the course of the different
        proposals?
      </div>
        { (chartData.data)&&
          <Line options={chartData.options} data={chartData.data} />
        }
      </div>
    );
}