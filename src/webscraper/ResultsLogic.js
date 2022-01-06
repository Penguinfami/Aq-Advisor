class ResultsLogic {
    
    constructor(model){
        this.model = model;
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
        console.log("a stocking");
        console.log(input.stocking[0]);
        let speciesName = this.urlifyString(input.stocking[0].name);
        let scientificName = this.urlifyString(input.stocking[0].scientificName);
        let speciesQuantity = input.stocking[0].quantity;

        let newURL = `www.aqadvisor.com/AqAdvisor.php?AquTankName=&AquListBoxTank=${tank}&AquTankLength=${length}&AquTankDepth=${depth}&AquTankHeight=${height}&FormSubmit=Update&AquListBoxFilter=${filter1}&AquTextFilterRate=${filterRate1}+&AquListBoxFilter2=${filter2}&AquTextFilterRate2=${filterRate2}+&AquFilterString=&` + 
        `AquListBoxChooser=${speciesName}+%28${scientificName}%29&AquTextBoxQuantity=${speciesQuantity}&AquTextBoxRemoveQuantity=&AlreadySelected=&FilterMode=Display+all+species&AqTempUnit=C&AqVolUnit=gUS&AqLengthUnit=inch&AqSortType=cname&FilterQuantity=${filterQuantity}&AqJuvMode=&AqSpeciesWindowSize=short&AqSearchMode=simple` 
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

    warnings(){
        return this.getFeedback('Warning:');
    }

    suggestions(){
        return this.getFeedback('Note:')
    }

    ranges(){

        let rangeStatements = this.model.getListByInnerText('Recommended', this.model.getElementsByTagName('font'));
        console.log("ranges");
        console.log(rangeStatements);
        let arr = [];

        for (let i = 0; i < rangeStatements.length; i++){
            let statement = rangeStatements[i];
            console.log("range");
            console.log(statement);
            let args = statement.split(':');
            if (!args[1]) continue;
            arr.push({title: args[0].trim(), value: args[1].trim().slice(0, -1)});
        }
        
        return arr;       
    }

    percentages(){
    
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
        
        console.log(possibleFinalWarning);

        let arr = [];

        for (let i = 0; i < statements.length; i++){
            let s = statements[i];
            if (s.includes("%")){ // provides a recommended percentage or a warning instead
                let args = s.trim().split(" ");
                let percent = '';
                for (let i = 0; i < args.length; i++){
                    if (args[i].includes("%")){
                        percent = args.slice(i).join(" ").replace(".", "");
                        break;
                    }
                }
                let sTitle = s.replace(percent, "").trim();
                arr.push({title: sTitle.replace(".", ""), value: percent});
            } else {
                arr.push({title: s.trim(), value: null});
            }
        }

        return arr;


    }

    capacityComment(){
        let commentsSection = this.model.getListByInnerText("Your aquarium filtration capacity for above selected species is");
        let textSlice = commentsSection[commentsSection.length - 1];
        let possibleComment = textSlice.split(".").filter((phrase) => phrase.includes("aquarium filtration capacity"));
        if (possibleComment[0].includes('%')) return false;
        return possibleComment[0];
    }


}

export default ResultsLogic;