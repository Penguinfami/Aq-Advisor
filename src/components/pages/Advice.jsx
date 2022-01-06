import TitleHeader from "../partials/TitleHeader"
import Button from "../partials/Button"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Advice = (props) => {

    const navigate = useNavigate();
    
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    },[])
    
    return (
        <div className="page">
            <TitleHeader/>
            {props.advice.warnings.length === 0 && props.advice.suggestions.length === 0 ?
                <div className="m-2">You have no warnings for this combination of species together.</div>
                : null 
            }
            {props.advice.warnings.length > 0 ?
                <div className="warning">
                    <h2 className="adviceHeading warningHeading">Warning!</h2>
                    {props.advice.warnings.map((warning) => <p className="warningMessage" key={warning.id}>{warning.message}</p>)}
                </div>    
                : null
            }
            {props.advice.suggestions.length > 0 ?
                <div className="suggestion">
                    <h2 className="adviceHeading suggestionHeading">Suggestion:</h2>
                    {props.advice.suggestions.map((suggestion) => <p className="suggestionMessage" key={suggestion.id}>{suggestion.message}</p>)}
                </div>    
                : null           
            }
            <Button onClick={() => navigate(props.nextPage)}className="nextButton" title="Next" />
        </div>
    )
}

export default Advice
