import './App.css';
import 'chart.js/auto';
import VotesOverTime from './components/VotesOverTime/VotesOverTime.js'
import ProposalRecap from './components/ProposalRecap/ProposalRecap.js'
import TopVotersPerProposal from './components/TopVotersPerProposal/TopVotersPerProposal';
import VotesAddressDistribution from './components/VotesAddressDistribution/VotesAddressDistribution';
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
        <div className='charts-container'>
            <VotesOverTime/>
            <VotesAddressDistribution/>
        </div>
      </div>
    </div>
  );
}