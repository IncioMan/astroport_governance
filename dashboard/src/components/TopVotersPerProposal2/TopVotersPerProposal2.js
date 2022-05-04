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
import Slider from '@mui/material/Slider';
import './TopVotersPerProposal2.css';
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

export default function TopVotersPerProposal2(props) {
  const {topRange} = props
  const [range, setRange] = useState([90, 100])
  const [rawData, setRawData] = useState([])
  const [chartData, setChartData] = useState({options:null, data:null})

  const handleChange = (event, newValue) => {
    setRange(newValue);
  };
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/voting_power_cumulative")
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
          rawData.filter((d)=>d.vote=='for').filter((p)=>(p.n_addresses_perc<=range[1])&&(p.n_addresses_perc>=range[0])).map((d)=>
          {
            let datapoint = {}
            datapoint.x = (0.1 - 0.2*Math.random()) + d.proposal_id
            datapoint.y = (Math.random())*1000 + Math.round(d.voting_power/1000000/100)*100
            datapoint.voter = d.voter
            datapoint.proposal_id = d.proposal_id
            return datapoint
          }),
          backgroundColor: '#7fe6a2'
        },
        {
          label: 'Against',
          data:
          rawData.filter((d)=>d.vote=='against').filter((p)=>(p.n_addresses_perc<=range[1])&&(p.n_addresses_perc>=range[0])).map((d)=>
          {
            let datapoint = {}
            datapoint.x = (0.1 - 0.2*Math.random()) + d.proposal_id
            datapoint.y = (Math.random())*1000 + Math.round(d.voting_power/1000000/100)*100
            datapoint.voter = d.voter
            datapoint.proposal_id = d.proposal_id
            return datapoint
          }),
          backgroundColor: '#ef5176'
        }
      ],
  }

  

    const labels = [...new Set(rawData.map((p)=>p.proposal_id))];
    const options = {
      plugins: {
        legend:{
          display: false
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                let labelVoter = ''
                let labelVotingPower = ''
                let labelPorposalId = ''
                if (context.raw.voter) {
                    labelVoter += 'Voter: '+context.raw.voter
                    labelPorposalId += 'Proposal: '+context.raw.proposal_id
                    labelVotingPower += 'Voting power: ' + Math.round(context.raw.y/1000000*100)/100 + 'M'
                }
                return [label, labelPorposalId, labelVoter, labelVotingPower];
            }
        }
        }
      },
      elements: {
        point:{
          borderWidth: 0,
          radius: 3
        }
      },
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
  },[rawData,range])
  

  return (
    <div className='chart-container'>
      <div className='chart-title'>Voters Overview</div>
      <div className='chart-desc'>
        Single addresses might have much more power
        than other voters. In this chart we plot each single
        address who has voted for the different proposals. You can 
        select the range of voters according to their voting power.
        Try selecting the 99 to 100 range: this will only show you how 
        the top 1% of voters per voting power has voted.  
      </div>
      <div className='slider-box-container'>
        <div className='slider-text-container'><div className='slider-text'>Percentile:</div></div>
        <Slider className="slider-range"
          getAriaLabel={() => 'Temperature range'}
          value={range}
          step={0.1}
          onChange={handleChange}
          valueLabelDisplay="auto"
        />
        <div className='slider-text-container'><div className='slider-text'>{range[0]}-{range[1]}</div></div>
      </div>
      { (chartData.data)&&
        <Scatter options={chartData.options} data={chartData.data}/>
      }
    </div>
  );
}