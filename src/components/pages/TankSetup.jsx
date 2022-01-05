import TitleHeader from '../partials/TitleHeader'
import Button from '../partials/Button';
import OptionSelect from '../partials/OptionSelect';
import Error from '../partials/Error'
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TankSetup = (props) => {

    const sampleOptions = [
        {
            "value": "5g",
            "name": "5 gallon"
        },
        {
            "value": "10g",
            "name": "10 gallon"
        },
        {
            "value": "29g",
            "name": "29 gallon"
        },
        {
            "value": "50g",
            "name": "50 gallon"
        },
    ]


    const [errorMessage, toggleErrorMessage] = useState(false);
    const [errorMessageContent, setErrorMessageContent] = useState("");

    const navigate = useNavigate();

    function handleChange(e){
        const {name, value} = e.target;
        console.log(value);
        switch (name) {
            case 'dimensions' : 
                props.setDimensions(sampleOptions.filter((option) => option.value === value)[0]); break;
            case 'filter1' : 
                 props.setFilters([sampleOptions.filter((option) => option.value === value)[0], props.filters[1]]); break;
            case 'filter2' :  
                props.setFilters([props.filters[0], sampleOptions.filter((option) => option.value === value)[0]]); break;
        }
    }

    const onNext = () => {
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

    return (
        <div className="page">
            {errorMessage ? <Error heading="Error" body={errorMessageContent} onClose={() => toggleErrorMessage(false)}/> : null}
            
            <Button title="Back" onClick={() => navigate(props.prevPage)} className="backButton"/>
            
            <TitleHeader/>
            
            <div className="dimensionsSelect selectionContainer">
                <label className="selectHeading" htmlFor="dimensions">Choose Tank Dimensions</label>
                <OptionSelect selected={ props.dimensions ? props.dimensions.value : null } onChange={handleChange}
                    name="dimensions" options={[{value: null, name:"Choose..."},...sampleOptions]}/>   
            </div>
            <div className="filterSelect selectionContainers">
                <label className="selectHeading" htmlFor="filter1">Choose Filter 1</label>
                <OptionSelect onChange={handleChange}
                    name="filter1" selected={ props.filters[0] ? props.filters[0].value : null} heading="Choose Filter 1" options={[{value: null, name:"Choose..."},...sampleOptions]}/>
                <Button className="text-decoration-none smallWhy" title="Why?"/>
            </div>
            <div className="filterSelect selectionContainer">
                <label className="selectHeading" htmlFor="filter2">Choose Filter 2</label>
                <OptionSelect selected={ props.filters[1] ? props.filters[1].value : null} onChange={handleChange}
                    name="filter2" heading="Choose Filter 2" options={[{value: null, name:"Choose..."}, ...sampleOptions]}/>
            </div>
            <Button title="Next" className="nextButton" onClick={() => onNext()}/>
        </div>
    )
}

export default TankSetup
