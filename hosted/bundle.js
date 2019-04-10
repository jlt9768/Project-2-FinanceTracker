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

var handleChange = function handleChange(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#username").val() == '' || $("#password").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required");
        return false;
    };

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), function () {});

    return false;
};

var createChangeWindow = function createChangeWindow() {
    document.querySelector("#changePassword").style.display = "block";
};
var handleOnChange = function handleOnChange(e) {
    loadFilteredFromServer();
};

var ChangeForm = function ChangeForm(props) {
    return React.createElement(
        "form",
        { id: "changeForm", name: "changeForm",
            onSubmit: handleChange,
            action: "/changePass",
            method: "POST",
            className: "changeForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Username: "
        ),
        React.createElement("input", { id: "username", type: "text", name: "username", placeholder: "Username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "password", type: "password", name: "pass", placeholder: "Current password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPassword", type: "password", name: "newPass", placeholder: "New Password" }),
        React.createElement(
            "label",
            { htmlFor: "newPass2" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPassword2", type: "password", name: "newPass2", placeholder: "Confirm new password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeChangeSubmit", type: "submit", value: "Change Password" })
    );
};

var Filter = function Filter(props) {
    return React.createElement(
        "div",
        { id: "reactFilter" },
        React.createElement(
            "label",
            { "class": "filterLabel", htmlfor: "filter" },
            "Type Filter: "
        ),
        React.createElement(
            "select",
            { id: "filterType", name: "filter", onChange: handleOnChange },
            React.createElement("option", { value: "", selected: true }),
            React.createElement(
                "option",
                { value: "Other" },
                "Other"
            ),
            React.createElement(
                "option",
                { value: "Monthly" },
                "Monthly"
            ),
            React.createElement(
                "option",
                { value: "Food" },
                "Food"
            ),
            React.createElement(
                "option",
                { value: "Clothing" },
                "Clothing"
            )
        ),
        "\xA0",
        React.createElement(
            "label",
            { "class": "filterLabel", htmlfor: "filter" },
            "Date Filter: "
        ),
        React.createElement("input", { id: "filterDate", type: "date", name: "date", onChange: handleOnChange })
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
            { htmlFor: "item" },
            "Item: "
        ),
        React.createElement("input", { id: "financeItem", type: "text", name: "item", placeholder: "Name of item" }),
        React.createElement(
            "label",
            { id: "amount", htmlFor: "amount" },
            "Amount: "
        ),
        React.createElement("input", { id: "financeAmount", type: "text", name: "amount", placeholder: "Cost of item" }),
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
                { value: "Other", selected: true },
                "Other"
            ),
            React.createElement(
                "option",
                { value: "Monthly" },
                "Monthly"
            ),
            React.createElement(
                "option",
                { value: "Food" },
                "Food"
            ),
            React.createElement(
                "option",
                { value: "Clothing" },
                "Clothing"
            )
        ),
        React.createElement(
            "label",
            { htmlFor: "date" },
            "Date: "
        ),
        React.createElement("input", { id: "financeDateInput", type: "date", name: "date" }),
        React.createElement("input", { id: "csrf", type: "hidden", name: "_csrf", value: props.csrf }),
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
            React.createElement(
                "h3",
                { className: "financeDate" },
                "Date: \xA0\xA0 ",
                finance.date
            ),
            React.createElement(
                "h3",
                { className: "financeItem" },
                " Item: \xA0\xA0   ",
                finance.item
            ),
            React.createElement(
                "h3",
                { className: "financeAmount" },
                " Amount: \xA0\xA0    $",
                finance.amount
            ),
            React.createElement(
                "h3",
                { className: "financeType" },
                " Type: \xA0\xA0    ",
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
    sendAjax('GET', '/getFinances', null, function (data) {
        var filtered = data.finances.filter(function (value, index, arr) {
            if (($("#filterType").val().toLocaleLowerCase() === "" || value.type.toLocaleLowerCase() === $("#filterType").val().toLocaleLowerCase()) && ($("#filterDate").val() === "" || value.date === $("#filterDate").val())) {
                return value;
            }
        });

        ReactDOM.render(React.createElement(FinanceList, { finances: filtered }), document.querySelector("#finances"));
    });
};

var loadFinancesFromServer = function loadFinancesFromServer() {
    sendAjax('GET', '/getFinances', null, function (data) {
        ReactDOM.render(React.createElement(FinanceList, { finances: data.finances }), document.querySelector("#finances"));
    });
};

var setup = function setup(csrf) {

    ReactDOM.render(React.createElement(ChangeForm, { csrf: csrf }), document.querySelector("#changePassword"));

    //$("#changeForm").style.display = "none";

    ReactDOM.render(React.createElement(FinanceForm, { csrf: csrf }), document.querySelector("#makeFinance"));

    ReactDOM.render(React.createElement(FinanceList, { finances: [] }), document.querySelector("#finances"));
    ReactDOM.render(React.createElement(Filter, null), document.querySelector("#filter"));

    var changeButton = document.querySelector("#changeButton");
    changeButton.addEventListener("click", function (e) {
        e.preventDefault();
        createChangeWindow(csrf);
        return false;
    });

    loadFinancesFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
    document.querySelector("#changePassword").style.display = "none";
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
