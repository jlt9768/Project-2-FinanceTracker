"use strict";

var handleFinance = function handleFinance(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#financeDate").val() == '' || $("#financeItem").val() == '') {
        handleError("All fields are required");
        return false;
    };

    sendAjax('POST', $("#financeForm").attr("action"), $("#financeForm").serialize(), function () {
        loadFinancesFromServer();
    });

    return false;
};

var handleOnChange = function handleOnChange(e) {
    loadFilteredFromServer();
};
var Filter = function Filter(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "label",
            { htmlfor: "filter" },
            "Filter: "
        ),
        React.createElement("input", { id: "filterText", type: "text", name: "filter", onChange: handleOnChange })
    );
};

var FinanceForm = function FinanceForm(props) {
    return React.createElement(
        "form",
        { id: "financeForm", name: "financeForm",
            onSubmit: handleFinance,
            action: "/finance",
            method: "POST",
            className: "financeForm"
        },
        React.createElement(
            "label",
            { htmlFor: "date" },
            "Date: "
        ),
        React.createElement("input", { id: "financeDate", type: "text", name: "date", placeholder: "Date of purchase" }),
        React.createElement(
            "label",
            { htmlFor: "item" },
            "Item: "
        ),
        React.createElement("input", { id: "financeItem", type: "text", name: "item", placeholder: "Name of item" }),
        React.createElement(
            "label",
            { htmlFor: "type" },
            "Type: "
        ),
        React.createElement(
            "select",
            { id: "financeType", name: "type" },
            React.createElement(
                "option",
                { value: "other", selected: true },
                "Other"
            ),
            React.createElement(
                "option",
                { value: "monthly" },
                "Monthly"
            ),
            React.createElement(
                "option",
                { value: "food" },
                "Food"
            ),
            React.createElement(
                "option",
                { value: "clothing" },
                "Clothing"
            )
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeFinanceSubmit", type: "submit", value: "Add Finance" })
    );
};

var FinanceList = function FinanceList(props) {
    if (props.finances.length === 0) {
        return React.createElement(
            "div",
            { className: "financeList" },
            React.createElement(
                "h3",
                { className: "emptyFinance" },
                "No Finances Yet"
            )
        );
    };

    var financeNodes = props.finances.map(function (finance) {
        console.log();
        return React.createElement(
            "div",
            { key: finance._id, className: "finance" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "financeDate" },
                "Date: ",
                finance.date
            ),
            React.createElement(
                "h3",
                { className: "financeItem" },
                " Item: ",
                finance.item
            ),
            React.createElement(
                "h3",
                { className: "financeType" },
                " Type: ",
                finance.type
            )
        );
    });

    return React.createElement(
        "div",
        { className: "financeList" },
        financeNodes
    );
};

var loadFilteredFromServer = function loadFilteredFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        var filtered = data.domos.filter(function (value, index, arr) {

            if ($("#filterText").val() === '' || value.name.toLocaleLowerCase() === $("#filterText").val().toLocaleLowerCase()) {
                return value;
            };
        });

        ReactDOM.render(React.createElement(DomoList, { domos: filtered }), document.querySelector("#domos"));
    });
};

var loadFinancesFromServer = function loadFinancesFromServer() {
    sendAjax('GET', '/getFinances', null, function (data) {
        ReactDOM.render(React.createElement(FinanceList, { finances: data.finances }), document.querySelector("#finances"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(FinanceForm, { csrf: csrf }), document.querySelector("#makeFinance"));

    ReactDOM.render(React.createElement(FinanceList, { finances: [] }), document.querySelector("#finances"));
    ReactDOM.render(React.createElement(Filter, null), document.querySelector("#filter"));
    loadFinancesFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
