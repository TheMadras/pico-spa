import './App.css';
import axios from 'axios'
import {useEffect, useState} from 'react';
import List from './List';

const Input = (props) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      props.onEnter(event.target)
    }
  }

  return <input type="text" onKeyDown={handleKeyDown} />
}

function App() {
  const [violations, setViolations] = useState([]);
  const [temps, setTemps] = useState([]);
  const [currTemp, setCurrTemp] = useState('');
  const [isMainPage, setIsMainPage] = useState(true);
  const [threshold, setThreshold] = useState(74);
  const [currName, setCurrName] = useState("name");
  const [number, setNumber] = useState('+14806690991');
  const [location, setLocation] = useState('nowhere');


  async function updateInfo() {
    const tempsResponse = await axios.get('http://localhost:3000/sky/cloud/ckywhoy01006pu2vyel94ccyl/temperature_store/temperatures');
    const violationsResponse = await axios.get('http://localhost:3000/sky/cloud/ckywhoy01006pu2vyel94ccyl/temperature_store/threshold_violations');
    setTemps(tempsResponse.data)
    setViolations(violationsResponse.data)
    setCurrTemp(tempsResponse.data[tempsResponse.data.length - 1].temperature || '')
  }

  async function getProfile() {
    const thresholdResponse = await axios.get('http://localhost:3000/sky/cloud/ckywhoy01006pu2vyel94ccyl/sensor_profile/threshold');
    const nameResponse = await axios.get('http://localhost:3000/sky/cloud/ckywhoy01006pu2vyel94ccyl/sensor_profile/current_name');
    const numberResponse = await axios.get('http://localhost:3000/sky/cloud/ckywhoy01006pu2vyel94ccyl/sensor_profile/contact_number');
    const locationResponse = await axios.get('http://localhost:3000/sky/cloud/ckywhoy01006pu2vyel94ccyl/sensor_profile/location');
    setThreshold(thresholdResponse.data)
    setCurrName(nameResponse.data)
    setNumber(numberResponse.data)
    setLocation(locationResponse.data)
  }

  function updateThreshold(e) {
    setThreshold(e.value)
    axios.post('http://localhost:3000/sky/event/ckywhoy01006pu2vyel94ccyl/1556/sensor/profile_updated', {
      threshold: parseInt(e.value)
    });
    e.value = ""
  }

  function updateName(e) {
    setCurrName(e.value)
    axios.post('http://localhost:3000/sky/event/ckywhoy01006pu2vyel94ccyl/1556/sensor/profile_updated', {
      current_name: e.value
    });
    e.value = ""
  }

  function updateLocation(e) {
    setLocation(e.value)
    axios.post('http://localhost:3000/sky/event/ckywhoy01006pu2vyel94ccyl/1556/sensor/profile_updated', {
      location: e.value
    });
    e.value = ""
  }

  function updateNumber(e) {
    setNumber(e.value)
    axios.post('http://localhost:3000/sky/event/ckywhoy01006pu2vyel94ccyl/1556/sensor/profile_updated', {
      contact_number: e.value
    });
    e.value = ""
  }

  useEffect(() => {
    updateInfo()
    const interval = setInterval(() => {
      updateInfo()
    }, 1500);
  
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    getProfile()
    return () => {}
  }, [isMainPage])

  return (
    <div className="App">
      <div className="App-view">
        <button className="main-button" onClick={() => setIsMainPage(!isMainPage)}>{isMainPage ? "View Pico Info" : "View Main Page"}</button>
        {
          isMainPage &&
          <>
            <h1>Pico Temperature</h1>
            <h3 className="curr-temp">Current Temperature: {currTemp}</h3>
            <List title={"All Temperatures"} items={temps}/>
            <List title={"Threshold Violations"} items={violations}/>
          </>
        }
        {
          !isMainPage &&
          <>
            <h1>Pico Information</h1>
            <div className="profile-section">
              Threshold: {threshold}
              <Input onEnter={updateThreshold}/>
            </div>
            <div className="profile-section">
              Current Name: {currName}
              <Input onEnter={updateName}/>
            </div>
            <div className="profile-section">
              Location: {location}
              <Input onEnter={updateLocation}/>
            </div>
            <div className="profile-section">
              Contact Number: {number}
              <Input onEnter={updateNumber}/>
            </div>
          </>
        }
      </div>
    </div>
  );
}

export default App;
