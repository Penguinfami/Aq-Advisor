import TitleHeader from "../partials/TitleHeader";
import Button from "../partials/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const Results = (props) => {

    const navigate = useNavigate();

    const reset = () => {
        navigate(props.nextPage);
        props.onReset();
    }

    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [])

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
                        props.ranges.map((range) => (
                             range.value !== null ?
                                !range.hasConflict ?                                   
                                    <div key={range.title} className="recommendation">
                                        <div className="recommendationTitle">
                                            {range.title}:
                                        </div>
                                        <div className="recommendationValue">
                                            {range.value}
                                        </div>
                                    </div> 
                                : <div key={range.title} className="recommendationComment recommendationConflict">
                                    <div className="recommendationConflictLabel">{range.title}</div>
                                    <ul className="rangeConflictList">
                                        {range.value.map((conflictListItem) => 
                                        <li key={conflictListItem[1]} className="rangeConflictListItem">
                                            <div className="recommendationConflictTitle">
                                                {`${conflictListItem[1]}`}
                                            </div>
                                            <div className="recommendationConflictValue">
                                                {`${conflictListItem[0]}`}
                                            </div>
                                        </li> 
                                        )}
                                    </ul>                                   
                                  </div>
                            :
                            <div key={range.title} className="recommendation recommendationComment">{range.title}</div>                         
                            
                        ))
                    }
                </div>
                <div className={`filtrationCapacityComment ${props.filtrationCapacityComment ? props.filtrationCapacityComment.includes("Warning") ? 'warningCapacityComment' : null : null}`}>
                    {props.filtrationCapacityComment}
                </div>
                <div className="recommendationsTable">
                {
                        props.percentages.map((percentage) => (

                            percentage.value !== null ? 

                            <div key={percentage.title} className="recommendation">
                                <div className="recommendationTitle">
                                    {percentage.title}
                                    {!percentage.title.includes(":") ? ':' : null}
                                </div>
                                <div className="recommendationValue">
                                    {percentage.value}
                                </div>
                            </div>

                            : <div key={percentage.title} className="recommendation recommendationComment">{percentage.title}</div>
                        ))
                    }               
                </div>
            </div>

            <Button className="spreadsheetButton" title="Generate Spreadsheet" onClick={() => alert("Spreadsheet generator to be added in the future. Screenshots only for now.")}/>           
            <Button onClick={() => reset()} title="Start over" className="backButton"/>

        </div>
    )
}

export default Results
