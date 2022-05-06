import 'chart.js/auto';
import MajorityPerVote from '../MajorityPerVote/MajorityPerVote'
import ProposalRecap from '../ProposalRecap/ProposalRecap.js'
import ProposalResults from '../ProposalResults/ProposalResults';
import TableProposals from '../TableProposals/TableProposals';
import { useState } from 'react';
import TopVotersPerProposal from '../TopVotersPerProposal/TopVotersPerProposal';
const axios = require('axios').default;



export default function Overview() {
  return (
      <>
      <div className='charts-container'>
            <TableProposals/>
            <ProposalResults/>
        </div>
          <div className='charts-container'>
            <ProposalRecap/>
            <TopVotersPerProposal topRange={2}/>
        </div>
        <div className='charts-container'>
            <MajorityPerVote/>
            <ProposalResults/>
        </div>
      </>
  );
}