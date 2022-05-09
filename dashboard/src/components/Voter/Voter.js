import 'chart.js/auto';
import './Voter.css';
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';
import { useState, useEffect } from 'react';
const axios = require('axios').default;

export default function Voter() {
  const [voters, setVoters] = useState([])
  const [options, setOptions] = useState([])

  function fuzzySearch(options) {
  
      return (value) => {
        let approvedOptions = []
        for(let i = 0; i < options.length; i++){
          let op = options[i]
          for(let j = 0; j < value.length; j++){
            console.log(op)
            if(!op.name?.includes(value[j])){
              break
            }
          }
          approvedOptions.push(op)
        }
        return approvedOptions
      };
  }

  
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/addr_vote")
        .then(function (response) {
          setVoters(response.data.map((p)=>p.voter))
        })
        .catch(function (error) {
            console.log(error);
        })
  },[])

  useEffect(()=>{
    setOptions(voters.map((v)=>{
      return {name: v, value: v}
    }))
  },[voters])

return (
      <>
         <SelectSearch
          options={options}
          search
          filterOptions={fuzzySearch}
          emptyMessage="Not found"
          placeholder="Select your country"
        />
      </>
  );
}