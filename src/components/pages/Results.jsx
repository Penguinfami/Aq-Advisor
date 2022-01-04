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
                    <span className="inputSummarySpecific"> {exampleInput.dimensions}</span> aquarium with filters 
                    {exampleInput.filters.map((filter) => <span key={filter.value} className="inputSummarySpecific">{` ${filter}, `}</span>)} containing
                    {exampleInput.stocking.map((species, index) => <span key={species.value} className="inputSummarySpecific">{` ${species}${ index !== exampleInput.stocking.length - 1 ? "," : ""}`}</span>)}:
                </p>
            </div>
            <div className="resultsDisplay">
                <div className="recommendationsTable">
                    {
                        exampleResults.ranges.map((range) => (
                            <div key={range.title} className="recommendation">
                                <div className="recommendationTitle">
                                    {range.title}
                                </div>
                                <div className="recommendationValue">
                                    {range.value}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="filtrationCapacityComment">
                    {exampleResults.filtrationCapacityComment}
                </div>
                <div className="recommendationsTable">
                {
                        exampleResults.percentages.map((percentage) => (
                            <div className="recommendation">
                                <div className="recommendationTitle">
                                    {percentage.title}
                                </div>
                                <div className="recommendationValue">
                                    {percentage.value}
                                </div>
                            </div>
                        ))
                    }               
                </div>
            </div>

            <Button className="spreadsheetButton" title="Generate Spreadsheet" onClick={() => alert("Spreadsheet Generated!")}/>           
        </div>
    )
}

export default Results
