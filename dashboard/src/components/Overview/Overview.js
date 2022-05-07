import 'chart.js/auto';
import MajorityPerVote from '../MajorityPerVote/MajorityPerVote'
import ProposalRecap from '../ProposalRecap/ProposalRecap.js'
import ProposalResults from '../ProposalResults/ProposalResults';
import TableProposals from '../TableProposals/TableProposals';
import TopVotersPerProposal from '../TopVotersPerProposal/TopVotersPerProposal';
import './Overview.css';
const axios = require('axios').default;



export default function Overview() {
  return (
      <>
        <div className='table-chart-container'>
            <TableProposals/>
            <ProposalResults/>
        </div>
        <div style={{height: '24px'}}/>
        <div className='charts-container'>
            <ProposalRecap/>
        </div>
        <div className='charts-container'>
            <TopVotersPerProposal topRange={2}/>
        </div>
        <div className='charts-container'>
            <MajorityPerVote/>
        </div>
      </>
  );
}