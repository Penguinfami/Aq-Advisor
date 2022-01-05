class ResultsLogic {
    
    constructor(model){
        this.model = model;
    }

    createURL(dataInput){
        return; // post
    }

    getFeedback(preface){
        let textList = this.model.getInnerTextList(this.model.getElementsByTagName('li'));
        let arr = [];
        for (let i = 0; i < textList.length; i++){
            let item = textList[i];
            if (item.contains(preface)){
                arr.push(item.replace(preface, "").trim());
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

        let rangeStatements = this.model.getListByInnerText('Recommended ', this.model.getElementsByTagName('font'));
        
        let arr = [];

        for (let statement in rangeStatements ){
            let args = statement.split(':');
            arr.push({title: args[0].trim(), range: args[1].trim()});
        }
        
        return arr;       
    }

    percentages(){

        let statements = [];

        let filtrationCapacityForSpecies = this.model.getListByInnerText("Your aquarium filtration capacity for");

        statements.push(filtrationCapacityForSpecies[0]);

        let stockingLevel = this.model.getListByInnerText("Your aquarium stocking level is")
        statements.push(stockingLevel[0]);
        
        let waterChangeComment = this.model.getNextSiblingInnerText(this.model.getElementByInnerText("Your aquarium stocking level is"));
        statements.push(waterChangeComment[0]);

        let arr = [];

        for (let s in statements){
            if (s.contains("%")){ // provides a recommended percentage or a warning instead
                let args = s.trim().split(" ");
                let percent = args[-1]; // [%]
                let sTitle = s.replace(percent[0], "").trim();
                arr.push({title: sTitle, percentage: percent[0]});
            } else {
                arr.push({title: s.trim(), percentage: null});
            }
        }

        return arr;


    }


}

export default ResultsLogic;