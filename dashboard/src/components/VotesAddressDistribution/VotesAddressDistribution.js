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
  const {proposalId} = props
  const [rawData, setRawData] = useState([])
  const [chartData, setChartData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/voting_power_cumulative")
        .then(function (response) {
          setRawData(response.data)
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
      labels: [...rawData.filter((d)=>d.proposal_id==proposalId).map((p)=> p.n_addresses)],
      datasets: [{
          label: '',
          data:
          rawData.filter((d)=>d.proposal_id==proposalId).map((d)=>
          {
            return d.voting_power_cumsum
          }),
          fill: false,
          borderColor: '#7fe6a2',
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
          stacked: true,
          grid:{
            display: false
          }
        },
        y: {
          grid:{
            display: false
          }
        },
      },
    };
    
    const cd = {
      options: options,
      data: data
    }
    setChartData(cd)
    console.log(chartData, cd)
  },[rawData, proposalId])

    console.log(chartData.options, chartData.data)
    return (
      <div className='chart-container'>
      <div className='chart-title'>Cumulative Voting Power</div>
      <div className='chart-desc'>
        A detailed distribution of the amount of governance power of the 
        single voters in this proposal is depicted in the following chart.
        We can inspect the chart to ask the question: how many addresses were
        needed to reach the X% of voting power? What percentage did the top X addresses
        have?
      </div>
        { (chartData.data)&&
          <Line options={chartData.options} data={chartData.data} />
        }
      </div>
    );
}