import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import './ProposalNumberUsers.css';
const axios = require('axios').default;


ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.color = "#fff";
ChartJS.defaults.backgroundColor = "#fff";

export default function ProposalNumberUsers(props) {
  const {proposalId} = props
  const [rawData, setRawData] = useState([])
  const [chartData, setChartData] = useState({options:null, data:null})
  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/n_addr")
        .then(function (response) {
          console.log('ciaooooo', response.data)
          setRawData(response.data.filter)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[proposalId])

  useEffect(()=>{
    if(rawData.length == 0){
      return
    }

    const data = {
      labels: [...new Set(rawData.map((p)=>p.result))],
      datasets: [
        {
          label: '# of Votes',
          data: rawData.map((p)=>p.proposal_id),
          backgroundColor: [
            '#ef5176',
            '#ffffff',
            '#7fe6a2'
          ],
          borderColor: [
            '#ef5176',
            '#ffffff',
            '#7fe6a2'
          ],
          borderWidth: 1,
        },
      ],
  }

  

    const options = {
      plugins: {
        legend:{
          display: true,
          position: 'right'
        },
        title: {
          display: false
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                let labelProposals = 'Number of proposals: '
                let labelResult='' 
                if (context.raw) {
                    labelResult += 'Result: '+context.label
                    labelProposals += context.raw
                }
                return [label,labelResult, labelProposals];
              }
            }
        }
      },
      responsive: true,
      radius: 110,
    };
    const cd = {
      options: options,
      data: data
    }
    setChartData(cd)
    console.log(chartData, cd)
  },[rawData])
  

  return (
    <div className='pie-chart-container'>
      <div className='pie-chart-title'>Votes Overview</div>
      <div className='chart-desc'>
        Not all proposals get voted through. Let's plot 
        how many proposals have passed/failed out of all the ones
        put up for vote. Have the majority of proposals passed?  
      </div>
      { (chartData.data)&&
        <div className='doughnut-container'>
         <Doughnut  options={chartData.options} data={chartData.data}/>
        </div>
      }
    </div>
  );
}