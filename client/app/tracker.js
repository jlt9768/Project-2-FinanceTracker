const handleFinance = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    if($("#financeDate").val() == '' || $("#financeItem").val() == '' ){
        handleError("All fields are required");
        return false;
    };
    
    sendAjax('POST', $("#financeForm").attr("action"), $("#financeForm").serialize(), function() {
       loadFinancesFromServer(); 
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


const FinanceForm = (props) => {
    return(
        <form id="financeForm" name = "financeForm"
            onSubmit = {handleFinance}
            action = "/finance"
            method="POST"
            className="financeForm"
        >
        
        <label htmlFor="date">Date: </label>
        <input id = "financeDate" type="text" name="date" placeholder = "Date of purchase"/>
        <label htmlFor="item">Item: </label>
        <input id = "financeItem" type="text" name="item" placeholder = "Name of item"/>
        <label htmlFor="type">Type: </label>
        <select id = "financeType" name = "type">
            <option value="other" selected>Other</option>
            <option value="monthly">Monthly</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
        </select>
        <input type = "hidden" name = "_csrf" value = {props.csrf}/>
        <input className = "makeFinanceSubmit" type = "submit" value = "Add Finance" />
        </form>
        

    );  
};

const FinanceList = function(props) {
    if(props.finances.length === 0){
      return(
          <div className ="financeList">
              <h3 className = "emptyFinance">No Finances Yet</h3>
          </div>
      );  
    };
    
    const financeNodes = props.finances.map(function(finance) {
            console.log();
            return(
            <div key={finance._id} className = "finance">
                <img src="/assets/img/domoface.jpeg" alt ="domo face" className = "domoFace" />
                <h3 className = "financeDate">Date: {finance.date}</h3>
                <h3 className = "financeItem"> Item: {finance.item}</h3>
                <h3 className = "financeType"> Type: {finance.type}</h3>
            </div>     
        );
         
    });
    
    return(
        <div className ="financeList">
            {financeNodes}
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

const loadFinancesFromServer = () => {
    sendAjax('GET', '/getFinances', null, (data) => {
       ReactDOM.render(
            <FinanceList finances={data.finances}/>, document.querySelector("#finances")
       ); 
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <FinanceForm csrf={csrf} />, document.querySelector("#makeFinance")
    );
    
    ReactDOM.render(
        <FinanceList finances= {[]} />, document.querySelector("#finances")
    );
    ReactDOM.render(
        <Filter />, document.querySelector("#filter")
    );
    loadFinancesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    }); 
};

$(document).ready(function() {
   getToken(); 
});