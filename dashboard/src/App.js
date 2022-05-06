import './App.css';
import 'chart.js/auto';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState } from 'react';
import Overview from './components/Overview/Overview';
import Proposal from './components/Proposal/Proposal';
const axios = require('axios').default;



export default function App() {
  const [proposalId, setProposalId] = useState(1)
  
  return (
      <div className='App'>
        <div className='App-header'>
          <div className='title-banner'>
            <a className='title-container' href={"http://localhost:3000/"}>
              <img src={"https://raw.githubusercontent.com/IncioMan/astroport_governance/master/images/logo.svg"}/>
              <div className='title'>Governance Dashboard</div>
            </a>
            <Navbar>
            <Container>
            <Navbar.Brand href="/"></Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link className='nav-link' href="/">Overview</Nav.Link>
                <Nav.Link className='nav-link' href="proposal">Proposal</Nav.Link>
                <Nav.Link className='nav-link' href="voter">Voter</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          </div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/proposal" element={<Proposal />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
  );
}