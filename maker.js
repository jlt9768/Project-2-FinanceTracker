const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoWeight").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    };
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
       loadDomosFromServer(); 
    });
    
    return false;
};

const handleOnChange = (e) =>{
    loadFilteredFromServer();
}
const Filter = (props) => {
  return(
      <div>
        <label htmlfor="filter">Filter: </label>
        <input id = "filterText" type="text" name = "filter" onChange={handleOnChange}/>
      </div>
  
  );  
};


const DomoForm = (props) => {
    return(
        <form id="domoForm" name = "domoForm"
            onSubmit = {handleDomo}
            action = "/maker"
            method="POST"
            className="domoForm"
        >
        
        <label htmlFor="name">Name: </label>
        <input id = "domoName" type="text" name="name" placeholder = "Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id = "domoAge" type="text" name="age" placeholder = "Domo Age"/>
        <label htmlFor="weight">Weight: </label>
        <input id = "domoWeight" type="text" name="weight" placeholder = "Domo Weight"/>
        
        <input type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "makeDomoSubmit" type = "submit" value = "Make Domo" />
        </form>
        

    );  
};

const DomoList = function(props) {
    if(props.domos.length === 0){
      return(
          <div className ="domoList">
              <h3 className = "emptyDomo">No Domos Yet</h3>
          </div>
      );  
    };
    
    const domoNodes = props.domos.map(function(domo) {
            console.log();
            return(
            <div key={domo._id} className = "domo">
                <img src="/assets/img/domoface.jpeg" alt ="domo face" className = "domoFace" />
                <h3 className = "domoName">Name: {domo.name}</h3>
                <h3 className = "domoAge"> Age: {domo.age}</h3>
                <h3 className = "domoWeight"> Weight: {domo.weight}</h3>
            </div>     
        );
         
    });
    
    return(
        <div className ="domoList">
            {domoNodes}
        </div>
    );
};

const loadFilteredFromServer = () =>{
    sendAjax('GET', '/getDomos', null, (data) => {
       let filtered = data.domos.filter(function(value,index,arr){
            
            if($("#filterText").val() === '' || value.name.toLocaleLowerCase() === $("#filterText").val().toLocaleLowerCase()){
                 return value;
            };
       });
       
       ReactDOM.render(
            <DomoList domos={filtered}/>, document.querySelector("#domos")
       ); 
    });
}

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
       ReactDOM.render(
            <DomoList domos={data.domos}/>, document.querySelector("#domos")
       ); 
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos= {[]} />, document.querySelector("#domos")
    );
    ReactDOM.render(
        <Filter />, document.querySelector("#filter")
    );
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    }); 
};

$(document).ready(function() {
   getToken(); 
});