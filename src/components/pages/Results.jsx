import TitleHeader from "../partials/TitleHeader";
import Button from "../partials/Button";
import { useNavigate } from "react-router-dom";

const Results = (props) => {

    const exampleInput = {
        "dimensions": "29g high",
        "filters" : ["Aqueon Quietflow 20"],
        "stocking": ["5x Sunset Platy", "5x Talking Catfish"]
    }

    const exampleResults = {
        "ranges" : [
            {
                "title" : "Recommended Temperature Range",
                "value" : "18-25C"
            },
            {
                "title" : "Recommended pH Range",
                "value" : "5.5-78"
            },            {
                "title" : "Recommended Hardness Range",
                "value" : "1-15 dH"
            }           
        ],
        "filtrationCapacityComment" : "You have plenty of aquarium filtration capacity",
        "percentages" : [
            {
                "title" : "Your aquarium filtration capacity is:",
                "value" : "219%"
            },
            {
                "title" : "Recommended Water Change Schedule is:",
                "value" : "9% per week"
            },
            {
                "title" : "Your aquarium stocking level is:",
                "value" : "46%"
            }
        ]
    }

    const navigate = useNavigate();

    return (
        <div className="page">
            <Button onClick={() => navigate(props.prevPage)} title="Back" className="backButton"/>
            <TitleHeader/>
            <div className="inputSummary">
                <p className="inputSummaryText">
                    For a 
                    <span className="inputSummarySpecific"> {props.dimensions.name}</span> aquarium with filters 
                    {props.filters.map((filter, index) => filter ? <span key={index} className="inputSummarySpecific"> {filter.name}, </span> : null)}
                    containing 
                    {props.species.map((species, index) => species ? <span key={index} className="inputSummarySpecific">{` ${species.quantity}x ${species.name}${index !== props.species.length - 1 ? ',' : ':'}`}</span>: null)}
                </p>
            </div>
            <div className="resultsDisplay">
                <div className="recommendationsTable">
                    {
                        props.results.ranges.map((range) => (
                             range.value !== null ?
                                <div key={range.title} className="recommendation">
                                    <div className="recommendationTitle">
                                        {range.title}:
                                    </div>
                                    <div className="recommendationValue">
                                        {range.value}
                                    </div>
                                </div> 
                            :
                            <div className="recommendation recommendationComment">{range.title}</div>                         
                            
                        ))
                    }
                </div>
                <div className="filtrationCapacityComment">
                    {props.results.filtrationCapacityComment}
                </div>
                <div className="recommendationsTable">
                {
                        props.results.percentages.map((percentage) => (

                            percentage.value !== null ? 

                            <div key={percentage.title} className="recommendation">
                                <div className="recommendationTitle">
                                    {percentage.title}
                                </div>
                                <div className="recommendationValue">
                                    {percentage.value}
                                </div>
                            </div>

                            : <div className="recommendation recommendationComment">{percentage.title}</div>
                        ))
                    }               
                </div>
            </div>

            <Button className="spreadsheetButton" title="Generate Spreadsheet" onClick={() => alert("Spreadsheet Generated!")}/>           
        </div>
    )
}

export default Results
