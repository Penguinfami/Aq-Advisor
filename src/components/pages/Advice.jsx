import TitleHeader from "../partials/TitleHeader"
import Button from "../partials/Button"
import { useNavigate } from 'react-router-dom';
const Advice = (props) => {

    const exampleAdvice = {

        "warning" : [ 
            {
                "id" : 1,
                "message" : "Raphael Catfish is not recommended for your tank - it may eventually outgrow your tank space, potentially reaching up to 7 inches."
            }
        ],
        "suggestion" : [
            {
                "id" : 1,
                "message" : "If you want to keep more than 1 Sunset Platy, minimum recommend male to female ratio is 1:2 (M:F). You will be less likely to experience problem if you get even more females."

            }
        ]
    }

    const navigate = useNavigate();

    return (
        <div className="page">
            <Button onClick={() => navigate(props.prevPage)} title="Back" className="backButton"/>
            <TitleHeader/>
            {exampleAdvice.warning ?
             <div className="warning">
                <h2 className="adviceHeading warningHeading">Warning!</h2>
                {exampleAdvice.warning.map((warning) => <p className="warningMessage" key={warning.id}>{warning.message}</p>)}
            </div>    
            : null
            }
            {exampleAdvice.suggestion ?
             <div className="suggestion">
                <h2 className="adviceHeading suggestionHeading">Suggestion:</h2>
                {exampleAdvice.suggestion.map((suggestion) => <p className="suggestionMessage" key={suggestion.id}>{suggestion.message}</p>)}
            </div>    
            : null
            }
            <Button onClick={() => navigate(props.nextPage)}className="nextButton" title="Next" />
        </div>
    )
}

export default Advice
