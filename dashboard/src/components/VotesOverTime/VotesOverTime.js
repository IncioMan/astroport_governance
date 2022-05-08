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

export default function VotesOverTime(props) {
  const {proposalId} = props
  const [rawData, setRawData] = useState([])
  const [chartData, setChartData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/votes_over_time")
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
      labels: [...new Set(rawData.filter((d)=>d.proposal_id==proposalId).map((i, p)=> p))],
      datasets: [{
          label: 'For',
          data:
          rawData.filter((d)=>d.proposal_id==proposalId).sort((a, b) => a.hr.localeCompare(b.hr)).map((d)=>
          {
            let datapoint = {}
            datapoint.x = (0.1 - 0.2*Math.random()) + d.proposal_id
            datapoint.y = (Math.random())*1000 + Math.round(d.voting_power/1000000/100)*100
            datapoint.voter = d.voter
            datapoint.proposal_id = d.proposal_id
            return d.voting_power_for_cumsum
          }),
          fill: false,
          borderColor: '#7fe6a2',
          tension: 0.1
        },
        {
          label: 'Against',
          data:
          rawData.filter((d)=>d.proposal_id==proposalId)
                 .sort((a, b) => a.hr.localeCompare(b.hr))
                 .map((d)=>
          {
            let datapoint = {}
            datapoint.x = (0.1 - 0.2*Math.random()) + d.proposal_id
            datapoint.y = (Math.random())*1000 + Math.round(d.voting_power/1000000/100)*100
            datapoint.voter = d.voter
            datapoint.proposal_id = d.proposal_id
            return d.voting_power_against_cumsum
          }),
          fill: false,
          borderColor: '#ef5176',
          tension: 0.01
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
          text: 'Chart.js Line Chart',
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
          },
          title: {
            display: true,
            text: 'Number of hours since the start'
          }
        },
        y: {
          grid:{
            display: false
          },
          title: {
            display: true,
            text: 'Amount of Voting Power'
          }
        },
      },
    };
    
    const cd = {
      options: options,
      data: data
    }
    setChartData(cd)
  },[rawData,proposalId])

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
    return (
      <div className='chart-container'>
      <div style={{ width: "35%", minWidth: "250px"}}>
        <div className='chart-title'>Votes Distribution Over Tim</div>
        <div className='chart-desc'>
        In this chart we can observe the amount of votes
        for each option (for/against) over time. This can highlight
        patterns where some proposals have experienced a large consensus
        from the beginning and others have seen the result changed halfway or at the end
        of the voting period.
        </div>
      </div>
      <div style={{ width: "2%"}}></div>
      <div style={{ width: "63%", minWidth: "250px"}}>
        { (chartData.data)&&
          <Line options={chartData.options} data={chartData.data} />
        }
      </div>
    </div>
)}