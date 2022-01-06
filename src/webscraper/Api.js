class Api {
    
    constructor() {
        this.contents = "";
    }

    async getData(url, headers){

        const result = await fetch(url, {
            "method": "GET",
            "headers": headers
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.contents = data;
          })
          .catch(err => {
            console.log("error fetching");
            console.error(err);
          });

        return this.contents;
    }

    
}

export default Api;