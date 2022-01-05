import logo from './logo.svg';
import './App.css';
import './static/Mobile.css';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import Home from './components/pages/Home';
import TankSetup from './components/pages/TankSetup';
import StockingSetup from './components/pages/StockingSetup';
import Advice from './components/pages/Advice';
import Results from './components/pages/Results';
import Footer from './components/partials/Footer';
import Buffer from './components/pages/Buffer';
import Error from './components/partials/Error';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Api, DatabaseLogic, DOMConverter, ResultsLogic } from './webscraper';

function App() {

  const exampleAqData = {
    dimensionsList: [{}],
    filtersList: [{}],
    speciesList: [{}]
  }

  const [aqAdvisorData, setAqAdvisorData] = useState({});
  const [name, setName] = useState("");
  const [filters, setFilters] = useState([]);
  const [dimensions, setDimensions] = useState({});
  const [stocking, setStocking] = useState([[]]);
  const [advice, setAdvice] = useState([{}]);
  const [buffer, toggleBuffer] = useState(false);

  const [errorMessage, toggleErrorMessage] = useState(false);
  const [errorMessageContent, setErrorMessageContent] = useState("");

  const [dataFetched, setDataFetched] = useState(false);

  const api =  new Api();
  const resultsLogic = new ResultsLogic();
  const dom = new DOMConverter();

  const strURL = "http://www.aqadvisor.com/AqAdvisor.php?AquTankName=Christine&AquListBoxTank=Choose&AquTankLength=15&AquTankDepth=8&AquTankHeight=14&AquListBoxFilter=Aqua+FX+SPR-1800&AquTextFilterRate=118.8+&AquListBoxFilter2=Choose&AquTextFilterRate2=N%2FA+&AquFilterString=&AquListBoxChooser=Albino+Bristlenose+Pleco+%28Ancistrus+cf.+cirrhosus%29&AquTextBoxQuantity=13&FormSubmit=Add+%3E&AquTextBoxRemoveQuantity=&AlreadySelected=200909300001%3A1%3A%3A%2C200911261032%3A1%3A%3A&FilterMode=Display+all+species&AqTempUnit=C&AqVolUnit=gUS&AqLengthUnit=inch&AqSortType=cname&FilterQuantity=2&AqJuvMode=&AqSpeciesWindowSize=short&AqSearchMode=simple";

  const fetchDatabase = async () => {
    
    if (dataFetched) return;

    console.log("fetching");

    toggleBuffer(true);

    let data = '';

    /**const data = await api.getData("https://scrapingant.p.rapidapi.com/get?url=http%3A%2F%2Fwww.aqadvisor.com%2F&response_format=json", 
      {
        "x-rapidapi-host": "scrapingant.p.rapidapi.com",
        "x-rapidapi-key": "437c9ccfc2mshaadabe75763183cp1eaf97jsnc665d637d972"       
      }
    );*/

    if (data == ""){
      toggleErrorMessage(true);
      setErrorMessageContent("There was a problem fetching the live database from www.aqadvisor.com. The pre-existing static database will be used instead. Sorry about that :(");
      const staticDB = await fetchStaticDatabase();
      return;
    } else {
      console.log(data.content)
    }

    dom.parse(data.content);

    let dataLogic = new DatabaseLogic(dom);

    let dList = dataLogic.dimensions();

    let fList = dataLogic.filters();

    let sList = dataLogic.species();

    setAqAdvisorData({ dimensionsList: dList, filtersList: fList, speciesList: sList })

    setDataFetched(true);
    toggleBuffer(false);
    console.log("end of fetch data function");
  }

  // Since the web scraping API has limited amount of calls per month and I'm broke as hell, can fetch from pre-existing static database instead
  const fetchStaticDatabase = async () => {
    
    if (dataFetched) return;

    toggleBuffer(true);

    const staticData = require('./staticData.json');
    console.log(staticData);
    let dataLogic = new DatabaseLogic();
    console.log(staticData.tanks);
    let dList = dataLogic.dimensions(staticData.tanks);

    let fList = dataLogic.filters(staticData.filters);

    let sList = dataLogic.species(staticData.species);

    setAqAdvisorData({ dimensionsList: dList, filtersList: fList, speciesList: sList })

    setDataFetched(true);
    toggleBuffer(false);

  }
  
  const updateInput = (value, state, setState) => {
    setState(value)
    console.log(state)
  };

  return (
    <div className="App">
      <Router>
        {errorMessage ? <Error heading="Error" body={errorMessageContent} onClose={() => toggleErrorMessage(false)}/> : null}
          {!buffer ? 
            dataFetched ?
              <Routes>
                <Route path="/" element={<Home onNext={fetchDatabase} nextPage="/tank" updateInput={updateInput} name={name} setName={setName}/>}></Route>
                <Route path="/home" element={<Home onNext={fetchDatabase} nextPage="/tank" updateInput={updateInput} name={name} setName={setName}/>}></Route>
                <Route path="/tank" element={<TankSetup dimensionsList={aqAdvisorData.dimensionsList} filtersList={aqAdvisorData.filtersList} prevPage="/home" nextPage="/stocking" dimensions={dimensions} setDimensions={setDimensions} filters={filters} setFilters={setFilters}/>}></Route>
                <Route path="/stocking" element={<StockingSetup speciesList={aqAdvisorData.speciesList} prevPage="/tank" nextPage="/advice" updateInput={updateInput} stocking={stocking} setStocking={setStocking}/>}></Route>
                <Route path="/advice" element={<Advice prevPage="/stocking" nextPage="/results" advice={advice} />}></Route>
                <Route path="/results" element={<Results prevPage="/advice" />}></Route>                              
            </Routes>   
            : <Home onNext={fetchDatabase} nextPage="/tank" updateInput={updateInput} name={name} setName={setName}/>    
            : <Buffer/>
          }
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
