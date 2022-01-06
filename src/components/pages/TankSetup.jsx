import TitleHeader from '../partials/TitleHeader'
import Button from '../partials/Button';
import OptionSelect from '../partials/OptionSelect';
import Error from '../partials/Error'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollTo } from 'react-scroll-to';

const TankSetup = (props) => {
       
    var testo;
    const [errorMessage, toggleErrorMessage] = useState(false);
    const [errorMessageContent, setErrorMessageContent] = useState("");

    const navigate = useNavigate();

    function handleChange(e){
        const {name, value} = e.target;
        console.log(value);
        switch (name) {
            case 'dimensions' :
                props.setDimensions(props.dimensionsList.filter((option) => option.name === value)[0]); break;
            case 'filter1' : 
                 props.setFilters([props.filtersList.filter((option) => option.name === value)[0], props.filters[1]]); break;
            case 'filter2' :  
                props.setFilters([props.filters[0], props.filtersList.filter((option) => option.name === value)[0]]); break;
        }
        console.log(value);
    }

    const onNext = () => {
        console.log(props.dimensionsList);
        console.log(props.dimensions, props.filters[0]);
        if (!props.dimensions) {
            console.log("dimensions", props.dimensions);
            setErrorMessageContent("Missing tank dimensions.")
            return toggleErrorMessage(true);
        } else if (!props.filters[0]) {
            console.log("filter", props.filters[0])
            setErrorMessageContent("Missing at least 1 filter.");
            return toggleErrorMessage(true);
        }
        navigate(props.nextPage);
    }

    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    })

    return (
        <div className="page">
            {errorMessage ? <Error heading="Error" body={errorMessageContent} onClose={() => toggleErrorMessage(false)}/> : null}
            
            <Button title="Back" onClick={() => navigate(props.prevPage)} className="backButton"/>
            
            <TitleHeader/>
            
            <div className="dimensionsSelect selectionContainer">
                <label className="selectHeading" htmlFor="dimensions">Tank Dimensions</label>
                <OptionSelect className="setupSelect" selected={ props.dimensions ? props.dimensions.name : null } onChange={handleChange}
                    name="dimensions" options={[{value: null, name:"Choose..."},...props.dimensionsList]}/>   
            </div>
            <div className="measurements">               
                <div className="measurementNumber">
                    <label className="quantityHeading">Length</label>
                    <div className="measurement">
                        {props.dimensions ? props.dimensions.length : 0}
                    </div>
                </div>
                <div className="measurementNumber">
                    <label className="quantityHeading">Depth</label>
                    <div className="measurement">
                        {props.dimensions ? props.dimensions.depth : 0}
                    </div>
                </div>
                <div className="measurementNumber">
                    <label className="quantityHeading">Height</label>
                    <div className="measurement">
                        {props.dimensions ? props.dimensions.height : 0}
                    </div>
                </div>
            </div>
            <div className="filterSelect selectionContainer">
                <label className="selectHeading" htmlFor="filter1">Choose Filter 1</label>
                <OptionSelect className="setupSelect" onChange={handleChange}
                    name="filter1" selected={ props.filters[0] ? props.filters[0].value : null} heading="Choose Filter 1" options={[{value: null, name:"Choose...", capacity: null},...props.filtersList]}/>
                <a href="http://www.aqadvisor.com/articles/AqAdvisorIntro.php" title="aqadvisor calculator info" target="_blank">
                    <Button className="text-decoration-none smallWhy" title="Why?"/>
                </a>
            </div>
            <div className="filterSelect selectionContainer">
                <label className="selectHeading" htmlFor="filter2">Choose Filter 2</label>
                <OptionSelect className="setupSelect" selected={ props.filters[1] ? props.filters[1].value : null} onChange={handleChange}
                    name="filter2" heading="Choose Filter 2" options={[{value: null, name:"Choose...", capacity: null}, ...props.filtersList]}/>
            </div>
            <Button title="Next" className="nextButton" onClick={() => onNext()}/>
        </div>
    )
}

export default TankSetup
