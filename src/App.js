import logo from './logo.svg';
import './App.css';
import './static/Mobile.css';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from 'react-router-dom';
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
  const [aqAdvisorResults, setAqAdvisorResults] = useState({});

  const [name, setName] = useState("");
  const [filters, setFilters] = useState([]);
  const [dimensions, setDimensions] = useState({});
  const [stocking, setStocking] = useState([]);
  
  const [buffer, toggleBuffer] = useState(false);
  const [bufferMessage, setBufferMessage] = useState("");
  const [errorMessage, toggleErrorMessage] = useState(false);
  const [errorMessageContent, setErrorMessageContent] = useState("");

  const [dataFetched, setDataFetched] = useState(false);
  const [resultsFetched, setResultsFetched] = useState(false);

  const api =  new Api();
  const apiData = require('./apiData.json');

  const resultsLogic = new ResultsLogic();
  const dom = new DOMConverter();

  const fetchDatabase = async () => {
    
    if (dataFetched) return;

    console.log("fetching");
    setBufferMessage("Fetching fish database from www.aqadvisor.com...");
    toggleBuffer(true);

    let data = '';

    // for fetching live fish database. currently removed to limit number of API calls
    /**const data = await api.getData("https://scrapingant.p.rapidapi.com/get?url=http%3A%2F%2Fwww.aqadvisor.com%2F&response_format=json", 
      {
        "x-rapidapi-host": apiData.APIHost,
        "x-rapidapi-key": "apiData.APIKey       
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

  }

  // Since the web scraping API has limited amount of calls per month and I'm broke as hell, can fetch from pre-existing static database instead
  const fetchStaticDatabase = async () => {
    
    if (dataFetched) return;

    toggleBuffer(true);
    setBufferMessage("Fetching static database");
    const staticData = require('./staticData.json');
    console.log(staticData);
    let dataLogic = new DatabaseLogic();
    console.log(staticData.tanks);
    let dList = dataLogic.dimensions(staticData.tanks, staticData.lengths, staticData.depths, staticData.heights);

    let fList = dataLogic.filters(staticData.filters, staticData.filterCapacity);

    let sList = dataLogic.species(staticData.species);

    setAqAdvisorData({ dimensionsList: dList, filtersList: fList, speciesList: sList })

    setDataFetched(true);
    toggleBuffer(false);

  }

  const fetchResults = async () => {
    
    if (resultsFetched) return;

    // logic class
    let resultsLogic = new ResultsLogic(dom);

    let numFilters = 2;
    let filter2, filterRate2;
    if (!filters[1]){
      numFilters = 1;
    } else {
      numFilters = 2;
      filter2 = filters[1].name;
      filterRate2 = filters[1].capacity;
    }

    let input = {
      tank : dimensions.name,
      height: dimensions.height,
      length: dimensions.length,
      depth: dimensions.depth,
      filter1: filters[0].name,
      filter2: filter2,
      filterRate1: filters[0].capacity,
      filterRate2: filterRate2,
      filterQuantity: numFilters,
      stocking: stocking
    }

    let url = resultsLogic.createURL(input);

    toggleBuffer(true);
    setBufferMessage("Fetching results from www.aqadvisor.com. This may take a moment.");

    const data = await api.getData(url, 
      {
        "x-rapidapi-host": apiData.APIHost,
        "x-rapidapi-key": apiData.APIKey       
      }
    )

    if (data == ""){
      toggleErrorMessage(true);
      setErrorMessageContent("There was a problem fetching the live results from www.aqadvisor.com. Sorry about that :(");
      return;
    } 
    
    dom.parse(data.content);

    let wList = resultsLogic.warnings();

    let sList = resultsLogic.suggestions();

    let rList = resultsLogic.ranges();

    let pList = resultsLogic.percentages();

    let capacityComment = resultsLogic.capacityComment();

    setAqAdvisorResults({ warnings: wList, suggestions: sList, ranges: rList, percentages: pList, filtrationCapacityComment: capacityComment })

    setResultsFetched(true);
    toggleBuffer(false);

  }
  
  const updateInput = (value, state, setState) => {
    setState(value)
    console.log(state)
  };

  const reset = () => {
    setName("");
    setFilters([]);
    setDimensions({})
    setStocking([]);
    setResultsFetched(false);
  }

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
                <Route path="/stocking" element={<StockingSetup onNext={async () => fetchResults()} speciesList={aqAdvisorData.speciesList} prevPage="/tank" nextPage="/advice" updateInput={updateInput} selectedSpecies={stocking} setSelectedSpecies={setStocking}/>}></Route>
                <Route path="/advice" element={<Advice prevPage="/stocking" nextPage="/results" advice={{warnings: aqAdvisorResults.warnings, suggestions: aqAdvisorResults.suggestions }} />}></Route>
                <Route path="/results" element={<Results prevPage="/advice" nextPage="/home" onReset={reset} species={[...stocking]} dimensions={dimensions} filters={[...filters]} results={{ranges: aqAdvisorResults.ranges, percentages: aqAdvisorResults.percentages, filtrationCapacityComment: aqAdvisorResults.filtrationCapacityComment}}/>}></Route>                              
            </Routes>   
            : <Home onNext={fetchDatabase} nextPage="/tank" updateInput={updateInput} name={name} setName={setName}/>    
            : <Buffer message={bufferMessage}/>
          }
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
