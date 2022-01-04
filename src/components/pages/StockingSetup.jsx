import TitleHeader from '../partials/TitleHeader'
import Button from '../partials/Button';
import OptionSelect from '../partials/OptionSelect';
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
            "value": "cherrybarb",
            "name": "Cherry Barb",
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

    const quantityAddInput = useRef(), quantityRemoveInput = useRef();

    const [errorMessage, toggleErrorMessage] = useState(false);
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
        if (speciesToAdd === null || quantityAdd < 1) return toggleErrorMessage(true)
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
        if (speciesToRemove === null || quantityRemove < 1) return toggleErrorMessage(true)
        setSelectedSpecies(selectedSpecies.map(
            (species) => {
                if (species.value === speciesToRemove.value){
                    if (species.quantity < quantityRemove) return toggleErrorMessage(true);
                    return {...species, quantity : parseInt(species.quantity) - parseInt(quantityRemove) }
                } else {
                    return species
                }
            }
        ).filter((species) => species.quantity >= 1));
        console.log(quantityRemove)
        setQuantityRemove(1);
        quantityRemoveInput.current.value = 1;
    }

    const onNext = () => {
        if (props.s) {
            toggleErrorMessage(true);
        } else if (props.filter1 === null) {
            toggleErrorMessage(true);
        }
        navigate(props.nextPage);
    }

    return (
        <div className="page">
            <Button title="Back" onClick={() => navigate(props.prevPage)} className="backButton" routename="/tank"/>
            <TitleHeader/>
            <OptionSelect onChange={handleChange} selected={speciesToAdd ? speciesToAdd.value : null} name="chooseSpeciesListAdd" heading="Choose Fish Species" options={sampleOptions}/>
            <label htmlFor="quantityOfSpecies">Quantity</label>
            <input ref={quantityAddInput} onChange={handleChange} className="quantity" name="quantityOfSpecies" type="number" placeholder={quantityAdd}/>
            <Button onClick={() => addSpecies()} className="bg-secondary" title="Add"/>
            <div>(list of Selected species will be here)</div>
            {selectedSpecies.map((species) => (<div>{`${species.quantity}x ${species.name}`}</div>))}
            <OptionSelect onChange={handleChange} selected={speciesToRemove ? speciesToRemove.value : null} name="chooseSpeciesListRemove" heading="Selected Species"
                options={selectedSpecies.map((species) =>(
                    {
                        name:`${species.quantity}x ${species.name}`, 
                        value: species.value,
                        scientificName: species.scientificName
                    }
                    ))}/>

            <label htmlFor="quantityOfSelectedSpecies">Quantity</label>
            <input ref={quantityRemoveInput} onChange={handleChange} className="quantity" name="quantityOfSelectedSpecies" type="number" placeholder={quantityRemove}/>
            <Button onClick={() => removeSpecies()} title="Remove"/>
            <Button title="Next" onClick={() => onNext()} className="nextButton" routename="/advice"/>
        </div>
    )
}

export default StockingSetup