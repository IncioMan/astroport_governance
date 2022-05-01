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

axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/proposal_recap.json")
        .then(function (response) {
            console.log(response)
        })
        .catch(function (error) {
            console.log(error);
        })


export const options = {
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
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ['#1','#2','#3','#4'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Against',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'For',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'Abstain',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      backgroundColor: 'rgb(223, 223, 222)',
    },
  ],
};

export default function App() {
  return (
    <div className='App'>
        <div className='App-header'>
          <div className='charts-container'>
            <div className='chart-container'>
              <Bar options={options} data={data} />
            </div>
            <div className='chart-container'>
              <Bar options={options} data={data} />
            </div>
        </div>
      </div>
        </div>
  );
}