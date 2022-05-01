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
import { useEffect, useState } from 'react';
import ProposalRecap from './components/ProposalRecap/ProposalRecap.js'
const axios = require('axios').default;



export default function App() {
  
  return (
    <div className='App'>
        <div className='App-header'>
          <div className='charts-container'>
            <ProposalRecap/>
        </div>
      </div>
    </div>
  );
}