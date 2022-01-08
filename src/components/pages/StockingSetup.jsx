import TitleHeader from '../partials/TitleHeader'
import Button from '../partials/Button';
import OptionSelect from '../partials/OptionSelect';
import SelectList from '../partials/SelectList';
import Error from '../partials/Error';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StockingSetup = (props) => {

    const navigate = useNavigate();

    const quantityAddInput = useRef(), quantityRemoveInput = useRef(), speciesToAddList = useRef(), speciesToRemoveList = useRef();

    const [errorMessage, toggleErrorMessage] = useState(false);
    const [errorMessageContent, setErrorMessageContent] = useState("");
    const [speciesToAdd, setSpeciesToAdd] = useState(null);
    const [speciesToRemove, setSpeciesToRemove] = useState(null);
    const [quantityAdd, setQuantityAdd] = useState(1);
    const [quantityRemove, setQuantityRemove] = useState(1);
    
    function handleChange(e){
        const {name, value} = e.target;
        switch (name) {
            case 'chooseSpeciesListAdd':
                setSpeciesToAdd(props.speciesList.filter((species) => (species.name === value))[0]); break;
            case 'chooseSpeciesListRemove':
                setSpeciesToRemove(props.speciesList.filter((species) => (species.name === value))[0]); break;                
            case 'quantityOfSpecies' : 
                setQuantityAdd(value); break;
            case 'quantityOfSelectedSpecies' : 
                setQuantityRemove(value); break;
        }
    }

    const addSpecies = () => {
        if (speciesToAdd === null){
            toggleErrorMessage(true)
            setErrorMessageContent("No species selected to add")
            return;
        } else if (quantityAdd < 1) {
            toggleErrorMessage(true)
            setErrorMessageContent("The quantity to add must be 1 or greater")  
            return;
        } 
        if (errorMessage) return;
        let alreadyAdded = false;
        props.setSelectedSpecies(props.selectedSpecies.map(
            (species) => {
                if (species.value === speciesToAdd.value){
                    alreadyAdded = true;
                    return {...species, quantity : parseInt(species.quantity) + parseInt(quantityAdd) }
                } else {
                    return species
                }
            }
        ));
        if (!alreadyAdded){
            let newSpeciesEntry = {
                value: speciesToAdd.value,
                name: speciesToAdd.name,
                scientificName: speciesToAdd.scientificName,
                quantity: quantityAdd,
                speciesID: speciesToAdd.speciesID
            }
            props.setSelectedSpecies([...props.selectedSpecies, newSpeciesEntry ]);
        }
        setQuantityAdd(1);
        quantityAddInput.current.value = 1;
        console.log(quantityAdd)
    }

    const removeSpecies = () =>{
        if (!speciesToRemove){
            toggleErrorMessage(true)
            setErrorMessageContent("No species selected to remove.")
        } else if (quantityAdd < 1) {
            toggleErrorMessage(true)
            setErrorMessageContent("The quantity to remove must be 1 or greater.")  
        }

        let newSpeciesList = props.selectedSpecies.map(
                (species) => {
                if (species.value === speciesToRemove.value){
                    if (parseInt(species.quantity) < quantityRemove) {
                        setErrorMessageContent(`The quantity (${quantityRemove}) to remove is more than the amount of the species currently selected (${species.quantity}).`)
                        toggleErrorMessage(true) 
                        return species
                    }
                    else {
                        if (species.quantity === quantityRemove) setSpeciesToRemove(null);
                        return {...species, quantity : parseInt(species.quantity) - parseInt(quantityRemove) }
                    }
                } else {
                    return species
                }
            });
        if (errorMessage) {
            console.log("error");
            return;
        };
        props.setSelectedSpecies(newSpeciesList.filter((species) => parseInt(species.quantity) >= 1));
        console.log(speciesToRemove.value)
        setQuantityRemove(1);
        quantityRemoveInput.current.value = 1;
    }

    const onNext = async () => {
        if (props.selectedSpecies.length < 1) {
            toggleErrorMessage(true);
            setErrorMessageContent("No fish species have been added.")
            return;
        } 
        const next = await props.onNext();
        navigate(props.nextPage);
    }

    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [])

    return (
        <div className="page stockingPage">
            {errorMessage ? <Error heading="Error" body={errorMessageContent} onClose={() => toggleErrorMessage(false)}/> : null}
            <Button title="Back" onClick={() => navigate(props.prevPage)} className="backButton" routename="/tank"/>
            <TitleHeader/>
            <div className="selectionContainer speciesAddContainer">
                <label className="selectHeading" htmlFor={"speciesAdd"}>Choose Fish Species</label>
                <OptionSelect onChange={handleChange} className="speciesSelect add" size="8" name="chooseSpeciesListAdd" selectItem={setSpeciesToAdd} selected={speciesToAdd ? speciesToAdd.name : null} options={props.speciesList} />
                <div className="quantityInputs add">
                    <div className="quantityNumber">
                        <label className="quantityHeading" htmlFor="quantityOfSpecies">Quantity</label>
                        <input ref={quantityAddInput} onChange={handleChange} className="quantity" name="quantityOfSpecies" type="number" placeholder={quantityAdd}/>                       
                    </div>
                   <Button className="addButton quantityButton" onClick={() => addSpecies()} title="Add"/>
                </div>
            </div>
            
            <div className="selectionContainer speciesRemoveContainer">
                <label className="selectHeading" htmlFor={"speciesRemove"}>Selected Species</label>
                <SelectList onChange={handleChange} className="speciesSelect remove" size="8" name="chooseSpeciesListRemove" selectItem={setSpeciesToRemove} selected={speciesToRemove} 
                    options = {props.selectedSpecies.map((species) =>(
                        {
                            name:`${species.quantity}x ${species.name}`, 
                            value: species.value,
                            scientificName: species.scientificName
                        }
                        ))} />
                <div className="quantityInputs remove">
                    <div className="quantityNumber">
                        <label className="quantityHeading" htmlFor="quantityOfSelectedSpecies">Quantity</label>
                        <input ref={quantityRemoveInput} onChange={handleChange} className="quantity" name="quantityOfSelectedSpecies" type="number" placeholder={quantityRemove}/>
                    </div>
                    <Button className="removeButton quantityButton" onClick={() => removeSpecies()} title="Remove"/>
                </div>
            </div>
            
            <Button title="Next" onClick={async () => await onNext()} className="nextButton stockingNextButton"/>
            
        </div>
    )
}

export default StockingSetup