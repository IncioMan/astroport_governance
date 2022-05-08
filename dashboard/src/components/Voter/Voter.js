import 'chart.js/auto';
import './Voter.css';
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';
const axios = require('axios').default;

export default function Voter() {
  function fuzzySearch(options) {
      const fuse = new Fuse(options, {
          keys: ['name', 'groupName', 'items.name'],
          threshold: 0.3,
      });

      return (value) => {
          if (!value.length) {
              return options;
          }

          return fuse.search(value).map(({ item }) => item);
      };
  }

  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/IncioMan/astroport_governance/master/data/n_addr")
        .then(function (response) {
          setRawData(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
  },[proposalId])

  const options = [
    {name: 'Swedish', value: 'sv'},
    {name: 'English', value: 'en'}
];
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