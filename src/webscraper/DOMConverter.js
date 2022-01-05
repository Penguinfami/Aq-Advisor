class DOMConverter {

    constructor(){
        this.parser = new DOMParser()
    }

    parse(htmlString){
        this.elements = this.parser.parseFromString(htmlString, "text/html")
    }

    getElementById(id){
        return this.elements.getElementById(id)
    }

    getElementsByTagName(tag){
        return this.elements.getElementsByTagName(tag)
    }

    getElementsByClassName(className){
        return this.elements.getElementsByClassName(className)
    }

    getListByInnerText(text, list = []){
        let arr = [];

        let childElements = [];
        if (list.length === 0){
            childElements = this.elements.childNodes;
        } else {
            childElements = list.childNodes;
        }
        for (let i = 0; i < childElements.length; i++){
            let child = childElements[i];
            if (child.childNodes.length === 1 && child.innerText.contains(text)){
                arr.push(child.innerText);
            }
        }
        
        return arr;
    }

    getInnerTextList(list){
        let arr = [];
        for (let i = 0; i < list.length; i++){
            arr.push(list[i].innerText);
        }
        return arr;
    }

    getOptions(select){
        return select.options;
    }

    getElementByInnerText(text){

        let childElements =  this.elements.childNodes;
       
        for (let i = 0; i < childElements.length; i++){
            let child = childElements[i];
            if (child.childNodes.length === 1 && child.innerText.contains(text)){
                return child;
            }
        }
         
        return null;
    }

    getNextSiblingInnerText(element){
        return element.nextSibling.innerText;
    }

}

export default DOMConverter;