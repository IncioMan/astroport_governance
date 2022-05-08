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
        <div style={{height: '24px'}}/>
        <div className='charts-container'>
            <MajorityPerVote/>
        </div>
        <div style={{height: '24px'}}/>
        <div className='charts-container'>
          <div style={{ width: "35%", minWidth: "250px"}}>
            <div className='chart-title'>Single Voters Distribution</div>
            <div className='chart-desc'>
            A detailed distribution of the amount of governance power of the 
            single voters in this proposal is depicted in the following chart.
            We can inspect the chart to ask the question: how many addresses were
            needed to reach the X% of voting power? What percentage did the top X addresses
            have?
            </div>
          </div>
          <div style={{ width: "2%"}}></div>
          <div style={{ width: "63%", minWidth: "250px"}}>
            <TopVotersPerProposal/>
          </div>
        </div>
      </>
  );
}