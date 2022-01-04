import TitleHeader from "../partials/TitleHeader"
import Button from "../partials/Button"
import { useNavigate } from 'react-router-dom';
const Advice = (props) => {

    const navigate = useNavigate();

    return (
        <div className="page">
            <Button onClick={() => navigate(props.prevPage)} title="Back" className="backButton"/>
            <TitleHeader/>
            <div className="warning">
                <h2>Warning!</h2>
            </div>
            <div className="suggestion">
                <h2>Suggestion:</h2>
            </div>
            <Button onClick={() => navigate(props.nextPage)}className="nextButton" title="Next" />
        </div>
    )
}

export default Advice
