$(document).ready(function(){
    var login, transactions, transactionForm;
    renderLogin();
    $('#main').on('submit','#signInForm',function(e){
       authenticate(e);
    });
    $('#main').on('click','.logoutBut',function(e){
        deleteCookie('authToken');
        renderLogin();
     });
    $('#main').on('click', '#addTransaction',function(e) {
        renderTransactionForm();
     });
     $('#main').on('click', '#cancelTrans',function(e) {
        renderTransactions(false);
     });
     $('#main').on('submit','#transForm',function(e) {
        addTransaction(e);
     });


function setCookie(name,value) {
    document.cookie = name + "=" + (value || "") + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name){
    document.cookie = name+'=; Max-Age=-99999999;'+ "; path=/";  

}

function addTransaction(e){
    e.preventDefault();
    e.stopPropagation(); 
    showLoader($('#transForm'));
    var authToken = getCookie('authToken');
    var date = $("#date").val().trim();
    var merchant =  $("#merchant").val().trim();
    var amount = convertMoney($("#amount").val().trim());
    var url  = "corsproxy.php";
    $.ajax({
        type: 'post',
        url: url,
        data:{ 'url':'https://www.expensify.com/api?command=CreateTransaction', 'authToken': authToken, 'created' : date,  'amount': amount,'merchant': merchant },
        success: function(data){
            hideLoader($('#transform'));
            var data = JSON.parse(data);
            if (data["jsonCode"] == 407){
                alert("Session expired. Please login again");
                deleteCookie('authToken');
                renderLogin();
            }
            else if (data["jsonCode"] == 402){
                $('#formError').show();
            }
            else{ 
                renderTransactions(false);
                renderTable(data['transactionList']);
            }
        },
        fail:function(data){
            alert('Please Try Again');
        }
    });
    
}

function renderTransactionForm(){ 
    tempLogin =  $('#loginContent').detach();
    tempTransactions = $('#transactions').detach();
    if (tempLogin.length>0){
        login = tempLogin;
    }
    if (tempTransactions.length>0){
        transactions = tempTransactions;
    }
    $('#main').append(transactionForm);
    $('#formError').hide();
    $("#transForm").trigger('reset'); 
    $('#transactionForm').css("display", "block");

}

function renderTransactions(getNewTransactions = true){
    tempLogin =  $('#loginContent').detach();
    tempTransactionForm = $('#transactionForm').detach();
    if (tempLogin.length>0){
        login = tempLogin;
    }
    if (tempTransactionForm.length>0){
        transactionForm = tempTransactionForm
    }
    $('#main').append(transactions);
    $('#transactions').css("display", "block");
    if (getNewTransactions){ 
        $('#addTransaction').prop('disabled', true);
        $('#addTransaction').addClass("opacity");
        showLoader($('#tableBody'));
        getTransactions();
    }

}

function renderLogin(){
    if (getCookie('authToken')){
        renderTransactions();
    }
    else{
        tempTransactions =  $('#transactions').detach();
        tempTransactionForm = $('#transactionForm').detach();
        if (tempTransactions.length>0){
            transactions = tempTransactions;
        }
        if (tempTransactionForm.length>0){
            transactionForm = tempTransactionForm
        }
        $('#main').append(login);
        $("#signInForm").trigger('reset'); 
        $("#loginError").hide(); 
        $('#loginContent').css("display", "block");
    }
}

function convertMoney(dollars){
    var arr = dollars.replace(',', '').split('.');
    var cents = 0;
    if (arr.length >1){
        cents += parseInt(arr[1])
    }
    cents += parseInt(arr[0])*100
    return cents.toString();

}

function showLoader(opacityContainer){
    opacityContainer.addClass("opacity");
    $('.loading').css('display', 'block');
}

function hideLoader(opacityContainer){
    opacityContainer.removeClass("opacity");
    $('.loading').css('display', 'none');

}

function authenticate(e){
    e.preventDefault();
    e.stopPropagation(); 
    var email = $("#email").val();
    var password =  $("#password").val();
    var url  = "corsproxy.php";
    $.ajax({
        type: 'post',
        url: url,
        data:{ 'url':'https://www.expensify.com/api?command=Authenticate', 'partnerName': '', 'partnerPassword' : '', 'partnerUserID': email, 'partnerUserSecret': password },
        success: function(data){
            var data = JSON.parse(data);
            if (data["jsonCode"] !== 200){
                $('#loginError').show();
            }else{
            setCookie('authToken',data["authToken"]);
            renderTransactions();
            }
        },
        fail:function(data){
            alert('Please Try Again');
        }
        });
}


function getTransactions(){
    var authToken = getCookie('authToken');
    var url  = "corsproxy.php";
    var startDate = "";
    var endDate = "";
    $.ajax({
        type: 'get',
        url: url,
        data:{ 'url':'https://www.expensify.com/api?command=Get', 'authToken': authToken, 'returnValueList' : 'transactionList', 'startDate': startDate, 'endDate': endDate },
        success: function(data){
            var data = JSON.parse(data);
            if (data["jsonCode"] == 407){
                alert("Session expired. Please login again");
                deleteCookie('authToken');
                renderLogin();
            }
            else if (data["jsonCode"] !== 200){
                $('#error').show();
            }else{
                renderTable(data['transactionList']);
            }
        },
        fail:function(data){
            alert('Please Try Again');
         }
        });
        return false;
}

function renderTable(data){
    var newRows = document.createDocumentFragment();
    for (var i= 0; i<data.length; i++) {
    var row = document.createElement("tr");
    row.innerHTML="<td class='column1'>" + data[i].created + "</td><td class='column2'>" + data[i].merchant + "</td><td class='column3'>" + data[i].amount.toString()+ "</td>"
    newRows.appendChild(row);
    }
    document.getElementById("tableBody").appendChild(newRows);
    hideLoader($('#tableBody'));
    //allow add transition button to be clicked
    $('#addTransaction').removeClass("opacity");
    $('#addTransaction').prop('disabled', false);
}





});