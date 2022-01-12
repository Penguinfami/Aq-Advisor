class ResultsLogic {
    
    constructor(model, species){
        this.model = model;
        this.capacityComment = null;
        this.ranges = null;
        this.percentages = null;
        this.species = species;

    }

    setDOMModel(model){
        this.model = model;
    }
 
    urlifyString(oldString){
        let newStr = oldString.replaceAll(" ", "+")
        return newStr;
    }

    createURL(input){

        let tank = this.urlifyString(input.tank.trim());
        let length = input.length;
        let depth = input.depth;
        let height = input.height;
        let filter1 = this.urlifyString(input.filter1);
        let filter2, filterRate2, filterQuantity;
        if (!input.filter2){
            filter2 = "Choose"
            filterRate2 = "N%2FA"
            filterQuantity = 1
        } else {
            filter2 = this.urlifyString(input.filter2);
            filterRate2 = input.filterRate2;
            filterQuantity = 2
        }
        let filterRate1 = input.filterRate1;

        let speciesURLString = input.stocking[0].speciesID + "%3A" + input.stocking[0].quantity + "%3A%3A";
        for ( let i = 1; i < input.stocking.length; i++){
            speciesURLString += "%2C" + input.stocking[i].speciesID + "%3A" + input.stocking[i].quantity + "%3A%3A";
        }

        console.log(speciesURLString)

        let newURL = `www.aqadvisor.com/AqAdvisor.php?AquTankName=&AquListBoxTank=${tank}&AquTankLength=${length}&AquTankDepth=${depth}&AquTankHeight=${height}&FormSubmit=Update&AquListBoxFilter=${filter1}&AquTextFilterRate=${filterRate1}+&AquListBoxFilter2=${filter2}&AquTextFilterRate2=${filterRate2}+&AquFilterString=&` + 
        `AquListBoxChooser=&AquTextBoxQuantity=&AquTextBoxRemoveQuantity=&AlreadySelected=${speciesURLString}&FilterMode=Display+all+species&AqTempUnit=C&AqVolUnit=gUS&AqLengthUnit=inch&AqSortType=cname&FilterQuantity=${filterQuantity}&AqJuvMode=&AqSpeciesWindowSize=short&AqSearchMode=simple` 
        console.log(newURL);
        
        let fullURL = "https://scrapingant.p.rapidapi.com/get?url=" + encodeURIComponent(newURL) + "&response_format=json"; // post
        
        return fullURL;
    
    }
    
    getFeedback(preface){
        let textList = this.model.getInnerTextList(this.model.getElementsByTagName('li'));
        let arr = [];
        for (let i = 0; i < textList.length; i++){
            let item = textList[i];
            if (item.includes(preface)){
                arr.push({message: item.replace(preface, "").trim(), id: i});
            }
        }
        return arr;        
    }

    getWarnings(){
        return this.getFeedback('Warning:');
    }

    getSuggestions(){
        return this.getFeedback('Note:').concat(this.getFeedback('Suggestion:'))
    }

    getRanges(){
        let fontElements = this.model.getElementsByTagName('font')
        let rangeStatements = this.model.getListByInnerText('Recommended', fontElements);
        let arr = [];
        
        for (let i = 0; i < rangeStatements.length; i++){
            let statement = rangeStatements[i];
            let args = statement.split(':');
            if (!args[1]) continue;
            arr.push({title: args[0].trim(), value: args[1].trim().slice(0, -1), hasConflict: false});
        }

        if (arr.length < 3){
            let filtrationCapacityForSpecies = this.model.getListByInnerText("Your aquarium filtration capacity for above selected species is");
            let textSlice = filtrationCapacityForSpecies[filtrationCapacityForSpecies.length - 1]; 
            let compatiblilityStatements = this.model.getListByInnerText('compatible', fontElements);
            let lastSpecies = this.species[this.species.length - 1].name;
            for (let i = 0; i < compatiblilityStatements.length; i++){
                let currentSection = textSlice.slice(textSlice.indexOf(compatiblilityStatements[i]) + compatiblilityStatements[i].length)
                let endIndex = currentSection.indexOf(lastSpecies) + lastSpecies.length
                let lineSection = currentSection.slice(0, endIndex)
                let conflictLines = lineSection.trim().split("=>").map((line) => line.trim().split(":")).filter((line)=> line[0].trim() !== '');
                arr.push(
                    {title: compatiblilityStatements[i].trim(),
                        value: conflictLines,
                        hasConflict: true
                    });
            }            
        }
        
        this.ranges = arr;
        return arr;       
    }

    getPercentages(){
    
        let statements = [];

        let filtrationCapacityForSpecies = this.model.getListByInnerText("Your aquarium filtration capacity for above selected species is");
        
        let textSlice = filtrationCapacityForSpecies[filtrationCapacityForSpecies.length - 1];
        
        let filteredComment = textSlice.slice(textSlice.indexOf("Your aquarium filtration capacity for above selected species is"), textSlice.indexOf('%.') + 1);
        
        statements.push(filteredComment);

        console.log(textSlice);

        let stockingLevel = this.model.getListByInnerText("Your aquarium stocking level is")
        statements.push(stockingLevel[stockingLevel.length - 1]);
                
        let filtrationCapacityIndex = textSlice.indexOf("Your aquarium filtration capacity for");
        
        let waterChangeComment = textSlice.slice(textSlice.indexOf("%.", filtrationCapacityIndex) + 2, textSlice.indexOf("Your aquarium stocking level"));
        
        statements.push(waterChangeComment);

        let possibleFinalWarning = textSlice.slice(textSlice.lastIndexOf("%.") + 2, textSlice.indexOf("[Generate Image]"))
        
        statements.push(possibleFinalWarning);
        
        let arr = [];

        for (let i = 0; i < statements.length; i++){
            let s = statements[i];
            if (s.includes("%")){ // provides a recommended percentage or a warning instead
                let args = s.trim().split(" ");
                let percent = '';
                let sTitle;
                for (let i = 0; i < args.length; i++){
                    if (args[i].includes("%")){
                        percent = args.slice(i).join(" ").replace(".", "");
                        sTitle = args.slice(0, i).join(" ");
                        break;
                    }
                }
                arr.push({title: sTitle.replace(".", ""), value: percent});
            } else {
                arr.push({title: s.trim(), value: null});
            }
        }

        this.percentages = arr;

        return arr;

    }

    getCapacityComment(){
        let commentsSection = this.model.getListByInnerText("Your aquarium filtration capacity for above selected species is");
        let textSlice = commentsSection[commentsSection.length - 1];
        let lines = textSlice.split('\n');
        let filtrationSection = lines[lines.length - 1];
        let periodPhrases = filtrationSection.split('.');
        let possibleComment = periodPhrases.filter((phrase) => phrase.includes("aquarium filtration capacity"));

        if (possibleComment[0].includes('%')) {
            let exclamationSplit = periodPhrases.filter((phrase) => phrase.includes("!")).filter((phrase) => phrase.includes("aquarium filtration capacity"));
            if (exclamationSplit.length === 0) {
                this.capacityComment = false;
                return false;
            }
            possibleComment = exclamationSplit[0].slice(0, exclamationSplit[0].lastIndexOf('!') + 1);
            this.capacityComment = possibleComment
            return possibleComment;
        }
        return possibleComment[0];

    }


}

export default ResultsLogic;