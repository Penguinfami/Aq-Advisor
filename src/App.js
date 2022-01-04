import logo from './logo.svg';
import './App.css';
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import Home from './components/pages/Home';
import TankSetup from './components/pages/TankSetup';
import StockingSetup from './components/pages/StockingSetup';
import Advice from './components/pages/Advice';
import Results from './components/pages/Results';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [name, setName] = useState("");
  const [filters, setFilters] = useState([]);
  const [dimensions, setDimensions] = useState("");
  const [stocking, setStocking] = useState([[]]);
  const [advice, setAdvice] = useState([{}]);

  const updateInput = (value, state, setState) => {
    setState(value)
    console.log(state)
  };

  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path="/" element={<Home nextPage="/tank" updateInput={updateInput} name={name} setName={setName}/>}></Route>
          <Route path="/home" element={<Home nextPage="/tank"updateInput={updateInput} name={name} setName={setName}/>}></Route>
          <Route path="/tank" element={<TankSetup prevPage="/home" nextPage="/stocking" dimensions={dimensions} setDimensions={setDimensions} filters={filters} setFilters={setFilters}/>}></Route>
          <Route path="/stocking" element={<StockingSetup prevPage="/tank" nextPage="/advice" updateInput={updateInput} stocking={stocking} setStocking={setStocking}/>}></Route>
          <Route path="/advice" element={<Advice prevPage="/stocking" nextPage="/results" advice={advice} />}></Route>
          <Route path="/results" element={<Results prevPage="/advice" />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
