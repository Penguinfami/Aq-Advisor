class DatabaseLogic {

    constructor(model = null){
        this.model = model;
    }

    createValueFromName(givenName = ""){
        let value = givenName.replace(" ", "").toLowerCase();
        return value;
    }

    getOptionsList(selectId){
        return this.model.getInnerTextList(this.model.getOptions(this.model.getElementById(selectId)));
    }

    getSpeciesNames(string){
        let args = string.split('(');
        let commonName = args[0].trim();
        let scientificName = args[1].trim().slice(0,-1);
        return [commonName, scientificName];
    }

    dimensions(lst = null){
        
        let optionsList;
        let startIndex = 0;

        if (lst === null){
            console.log(lst);
            startIndex = 2;
            optionsList = this.getOptionsList('AquListBoxTank');
        } else {
            optionsList = lst
        }

        let arr = [];

        for (let i = startIndex; i < optionsList.length; i++){ // since the first 2 options are 'Choose' and 'User defined'
            let option = optionsList[i];
            let newDimension = {
                name : option.trim(),
                value : this.createValueFromName(option)
            }

            arr.push(newDimension);
        }

        return arr;
    }

    filters(lst = null){

        let optionsList;
        let startIndex = 0;
        if (lst === null){
            startIndex = 2;
            optionsList = this.getOptionsList('AquListBoxFilter');
        } else {
            optionsList = lst
        }

        let arr = [];
        
        for (let i = startIndex; i < optionsList.length; i++){ // since the first 2 options are 'Choose' and 'User defined'
            let option = optionsList[i];
            let newFilter = {
                name : option.trim(),
                value : this.createValueFromName(option)
            }
            arr.push(newFilter);
        }
        return arr;
    }

    species(lst = null){

        let optionsList;
        let startIndex = 0;
        if (lst === null){
            optionsList = this.getOptionsList('AquListBoxChooser');
            startIndex = 2;
        } else {
            optionsList = lst
        }

        let arr = [];
        
        for (let i = startIndex; i < optionsList.length; i++){ // since the first 2 options are 'Choose' and 'User defined'
            let option = optionsList[i];
            let names = this.getSpeciesNames(option);
            let newSpecies = {
                name : names[0],
                scientificName: names[1],
                value : this.createValueFromName(option)
            }
            arr.push(newSpecies);
        }
        return arr;
            
    }
}

export default DatabaseLogic;