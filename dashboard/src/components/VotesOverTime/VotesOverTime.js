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

    const proposal_id = 3

    const data = {
      labels: [...new Set(rawData.filter((d)=>d.proposal_id==proposal_id).map((i, p)=> p))],
      datasets: [{
          label: 'For',
          data:
          rawData.filter((d)=>d.proposal_id==proposal_id).sort((a, b) => a.hr.localeCompare(b.hr)).map((d)=>
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
          rawData.filter((d)=>d.proposal_id==proposal_id)
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

    console.log('ciao',[...new Set(rawData.map((i, p)=> p))])
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
  },[rawData])

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
    console.log(chartData.options, chartData.data)
    return (
      <div className='chart-container'>
        { (chartData.data)&&
          <Line options={chartData.options} data={chartData.data} />
        }
      </div>
    );
}