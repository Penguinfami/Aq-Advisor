class DOMConverter {

    constructor(){
        this.parser = new DOMParser()
    }

    setElements(htmlObj){
        let html = htmlObj.outerHTML;
        let data = {html: html};
        let json = JSON.stringify(data.html);
        this.parse(json);
        console.log(this.elements);
    }

    parse(htmlString){
        this.elements = this.parser.parseFromString(htmlString, "text/html")
        this.parsedString = htmlString;
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
            childElements = this.getElementsByTagName("*");
        } else {
            childElements = list;
        }
        for (let i = 0; i < childElements.length; i++){
            let child = childElements[i];

            if (child.childNodes.length === 1 && typeof child.innerText != 'undefined'){
                if (child.innerText.includes(text)){
                    arr.push(child.innerText);
                }
            }
        }

        
        return arr;
    }

    getInnerTextList(list = []){
        let arr = [];
        if (list === []) {
            list = this.getElementsByTagName("*");
        }
        for (let i = 0; i < list.length; i++){
            arr.push(list[i].innerText);
        }
        return arr;
    }

    getDOMInnerTestList(){
        let arr = []; 

        let childElements =  this.getElementsByTagName("*");

        for ( let i = 0; i < childElements.length; i++){
            let child = childElements[i];
        }
    }

    getOptions(select){
        return select.options;
    }

    getElementByInnerText(text){

        let childElements =  this.getElementsByTagName("*");
       
        for (let i = childElements.length - 1; i >= 0; i++){
            let child = childElements[i];
            if (child.innerText.includes(text)){
                return child;
            }
        }
        return null;
    }

    getNextSiblingInnerText(element){
        return element.nextSibling.innerText;
    }

    getPreviousSiblingInnerText(element){
        return element.previousSibling.innerText;
    }

    getStringArrayFromHTMLString(arrayStartIdentifier, endIdentifier, separator){

        if (!this.parsedString.contains(arrayStartIdentifier)) return false;
        let startSlice = this.parsedString.slice(this.parsedString.indexOf(arrayStartIdentifier));
        if (!startSlice.contains(endIdentifier)) return false;
        let fullSlice = startSlice.slice(0, startSlice.indexOf(endIdentifier));

        let arr = fullSlice.split(separator);
        
        return arr;
    }

}

export default DOMConverter;