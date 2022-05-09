import 'chart.js/auto';
import './Voter.css';
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const axios = require('axios').default;

export default function Voter() {
  const [inputText, setInputText] = useState('')
  const [voters, setVoters] = useState([])
  const [votersToDisplay, setVotersToDisplay] = useState([])


  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/addr_vote")
        .then(function (response) {
          setVoters(response.data.map((p)=>p.voter).filter((v)=>v!==null))
        })
        .catch(function (error) {
            console.log(error);
        })
  },[])

  useEffect(()=>{
    setVotersToDisplay(voters.filter((v)=>v.includes(inputText)))
  },[inputText])

  const handleTextInput = (e)=>{
    setInputText(e.target.value)
  }

  const handleOptionClick = (v)=>{
    console.log(v)
  }


return (
      <>
      <div className='addr-input-container'>
        <input 
              className='addr-input' 
              value={inputText} 
              type="text" 
              id="fname" 
              onChange={handleTextInput}
              name="ciao"
              autoFocus={true}/>
      </div>
      <div className='options-container'>
        {votersToDisplay.map((v)=>{
          return <div className='addr-option' onClick={() => handleOptionClick(v)}>{v}</div>
        })}
      </div>
      </>
  );
}