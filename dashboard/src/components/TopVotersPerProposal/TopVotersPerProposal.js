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
import './TopVotersPerProposal.css';
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

export default function TopVotersPerProposal(props) {
  const {iProposalsId, randomFactor} = props
  const [range, setRange] = useState([99, 100])
  const [rawData, setRawData] = useState([])
  const [proposalsId, setProposalsId] = useState(iProposalsId?iProposalsId:[])
  const [chartData, setChartData] = useState({options:null, data:null})
  const random = (randomFactor|randomFactor==0) ? randomFactor : 0.2
 
  const handleChange = (event, newValue) => {
    setRange(newValue);
  };
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/voting_power_cumulative")
        .then(function (response) {
          if(proposalsId.length===1){
          setRawData(response.data.filter((p)=>proposalsId.includes(p.proposal_id)))
          }else{
            setRawData(response.data)
          }
        })
        .catch(function (error) {
            console.log(error);
        })
  },[proposalsId])

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
            datapoint.x = ((random/2) - (random/2)*Math.random()) + d.proposal_id
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
            datapoint.x = ((random/2) - (random/2)*Math.random()) + d.proposal_id
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
          },
          title: {
            display: proposalsId.length!==1,
            text: 'Proposals'
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, ticks) {
                return proposalsId.length===1 ? null : '#' + (parseInt(value));
            }
          }
        },
        y: {
          grid:{
            display: false
          },
          title: {
            display: true,
            text: 'Governance Power'
          },
        }
      }
    };
    const cd = {
      options: options,
      data: data
    }
    setChartData(cd)
  },[rawData,range])
  

  return (
    <div className='chart-container'>
      <div className='slider-box-container-outer'>
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
      </div>
      { (chartData.data)&&
        <Scatter options={chartData.options} data={chartData.data}/>
      }
    </div>
  );
}