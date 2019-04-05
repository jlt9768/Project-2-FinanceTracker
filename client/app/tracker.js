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
      <div id="reactFilter">
        <label class = "filterLabel" htmlfor="filter">Type Filter: </label>
        <select id = "filterType" name = "filter" onChange={handleOnChange}>
            <option value="" selected></option>
            <option value="Other" >Other</option>
            <option value="Monthly">Monthly</option>
            <option value="Food">Food</option>
            <option value="Clothing">Clothing</option>
        </select>
          &nbsp;
        <label class = "filterLabel" htmlfor="filter">Date Filter: </label>
        <input id = "filterDate" type="date" name="date" onChange={handleOnChange}/>
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
        
        
        <label htmlFor="item">Item: </label>
        <input id = "financeItem" type="text" name="item" placeholder = "Name of item"/>
        <label id = "amount" htmlFor="amount">Amount: </label>
        <input id = "financeAmount" type="text" name="amount" placeholder = "Cost of item"/>
        <label htmlFor="type">Type: </label>
        <select id = "financeType" name = "type">
            <option value="Other" selected>Other</option>
            <option value="Monthly">Monthly</option>
            <option value="Food">Food</option>
            <option value="Clothing">Clothing</option>
        </select>
            <label htmlFor="date">Date: </label>
        <input id = "financeDateInput" type="date" name="date"/>
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
                
                <h3 className = "financeDate">Date: &nbsp;&nbsp; {finance.date}</h3>
                <h3 className = "financeItem"> Item: &nbsp;&nbsp;   {finance.item}</h3>
                <h3 className = "financeAmount"> Amount: &nbsp;&nbsp;    ${finance.amount}</h3>
                <h3 className = "financeType"> Type: &nbsp;&nbsp;    {finance.type}</h3>
                    
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
    sendAjax('GET', '/getFinances', null, (data) => {
       let filtered = data.finances.filter(function(value,index,arr){
            if(($("#filterType").val().toLocaleLowerCase() === "" || value.type.toLocaleLowerCase() === $("#filterType").val().toLocaleLowerCase()) 
               && ($("#filterDate").val() === "" || value.date === $("#filterDate").val())){
                 return value;
            }
       });
       
       ReactDOM.render(
            <FinanceList finances={filtered}/>, document.querySelector("#finances")
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