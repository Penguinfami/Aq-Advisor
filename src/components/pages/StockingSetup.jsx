import TitleHeader from '../partials/TitleHeader'
import Button from '../partials/Button';
import OptionSelect from '../partials/OptionSelect';
import SelectList from '../partials/SelectList';
import Error from '../partials/Error';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const StockingSetup = (props) => {

    const sampleOptions = [
        {
            "value": "sunsetplaty",
            "name": "Sunset Platy",
            "scientificName": "fivo gallonus"
        },
        {
            "value": "corycatfish",
            "name": "Cory Catfish",
            "scientificName": "fivo gallonus"

        },
        {
            "value": "molly",
            "name": "Molly",
            "scientificName": "fivo gallonus"
        },
        {
            "value": "cherrybarb1",
            "name": "Cherry Barb1",
            "scientificName": "fivo gallonus"
        },
        {
            "value": "cherrybarb2",
            "name": "Cherry Barb2",
            "scientificName": "fivo gallonus"
        },
        {
            "value": "cherrybarb3",
            "name": "Cherry Barb3",
            "scientificName": "fivo gallonus"
        },
        {
            "value": "cherrybarb4",
            "name": "Cherry Barb4",
            "scientificName": "fivo gallonus"
        },
        {
            "value": "cherrybarb5",
            "name": "Cherry Barb5",
            "scientificName": "fivo gallonus"
        },
    ]

    const sampleSelected = 
        [{
                "value": "sunsetplaty",
                "name": "Sunset Platy",
                "scientificName": "fivo gallonus",
                "quantity": 1
            }
        ]
    

    const navigate = useNavigate();

    const quantityAddInput = useRef(), quantityRemoveInput = useRef(), speciesToAddList = useRef(), speciesToRemoveList = useRef();

    const [errorMessage, toggleErrorMessage] = useState(false);
    const [errorMessageContent, setErrorMessageContent] = useState("");
    const [speciesToAdd, setSpeciesToAdd] = useState(null);
    const [speciesToRemove, setSpeciesToRemove] = useState(null);
    const [quantityAdd, setQuantityAdd] = useState(1);
    const [quantityRemove, setQuantityRemove] = useState(1);
    const [selectedSpecies, setSelectedSpecies] = useState([]);
    
    function handleChange(e){
        const {name, value} = e.target;
        console.log(e.target);
        switch (name) {
            case 'chooseSpeciesListAdd':
                setSpeciesToAdd(sampleOptions.filter((species) => (species.value === value))[0]); break;
            case 'chooseSpeciesListRemove':
                setSpeciesToRemove(selectedSpecies.filter((species) => (species.value === value))[0]); break;                
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
        } else if (quantityAdd < 1) {
            toggleErrorMessage(true)
            setErrorMessageContent("The quantity to add must be 1 or greater")  
        }
        let alreadyAdded = false;
        setSelectedSpecies(selectedSpecies.map(
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
                quantity: quantityAdd
            }
            setSelectedSpecies([...selectedSpecies, newSpeciesEntry ]);
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

        let newSpeciesList = selectedSpecies.map(
                (species) => {
                if (species.value === speciesToRemove.value){
                    if (species.quantity < quantityRemove) {
                        console.log(species);
                        toggleErrorMessage(true) 
                        setErrorMessageContent(`The quantity (${quantityRemove}) to remove is less than the amount of the species currently selected (${species.quantity}).`)
                        return species
                    }
                    else {
                        if (species.quantity == quantityRemove) setSpeciesToRemove(null);
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
        setSelectedSpecies(newSpeciesList.filter((species) => parseInt(species.quantity) >= 1));
        console.log(quantityRemove)
        setQuantityRemove(1);
        quantityRemoveInput.current.value = 1;
    }

    const onNext = () => {
        if (selectedSpecies.length < 1) {
            toggleErrorMessage(true);
            setErrorMessageContent("No fish species have been added.")
            return;
        } 
        navigate(props.nextPage);
    }

    return (
        <div className="page">
            {errorMessage ? <Error heading="Error" body={errorMessageContent} onClose={() => toggleErrorMessage(false)}/> : null}
            <Button title="Back" onClick={() => navigate(props.prevPage)} className="backButton" routename="/tank"/>
            <TitleHeader/>
            <div className="selectionContainer speciesAddContainer">
                <label className="selectHeading" htmlFor={"speciesAdd"}>Choose Fish Species</label>
                <SelectList name="speciesAdd" selectItem={setSpeciesToAdd} selected={speciesToAdd} items={sampleOptions} />
                <div className="quantityInputs">
                    <div className="quantityNumber">
                        <label className="quantityHeading" htmlFor="quantityOfSpecies">Quantity</label>
                        <input ref={quantityAddInput} onChange={handleChange} className="quantity" name="quantityOfSpecies" type="number" placeholder={quantityAdd}/>                       
                    </div>
                   <Button className="addButton quantityButton" onClick={() => addSpecies()} title="Add"/>
                </div>
            </div>
            
            <div className="selectionContainer speciesRemoveContainer">
                <label className="selectHeading" htmlFor={"speciesRemove"}>Selected Species</label>
                <SelectList name="speciesRemove" selectItem={setSpeciesToRemove} selected={speciesToRemove} items={sampleOptions} 
                    items= {selectedSpecies.map((species) =>(
                        {
                            name:`${species.quantity}x ${species.name}`, 
                            value: species.value,
                            scientificName: species.scientificName
                        }
                        ))} />
                <div className="quantityInputs">
                    <div className="quantityNumber">
                        <label className="quantityHeading" htmlFor="quantityOfSelectedSpecies">Quantity</label>
                        <input ref={quantityRemoveInput} onChange={handleChange} className="quantity" name="quantityOfSelectedSpecies" type="number" placeholder={quantityRemove}/>
                    </div>
                    <Button className="removeButton quantityButton" onClick={() => removeSpecies()} title="Remove"/>
                </div>
            </div>
            
            <Button title="Next" onClick={() => onNext()} className="nextButton stockingNextButton"/>
        </div>
    )
}

export default StockingSetup