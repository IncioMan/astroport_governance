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
import TopVotersPerProposal from './components/TopVotersPerProposal/TopVotersPerProposal';
const axios = require('axios').default;



export default function App() {
  
  return (
    <div className='App'>
        <div className='App-header'>
          <a href={"https://lbp.neb.money/"}>
            <img src={"https://raw.githubusercontent.com/IncioMan/astroport_governance/master/images/logo.svg"}/>
          </a>
          <div className='charts-container'>
            <ProposalRecap/>
            <TopVotersPerProposal/>
        </div>
      </div>
    </div>
  );
}