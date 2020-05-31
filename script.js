$(document).ready(function(){
    var login, transactions, transactionForm;
    renderLogin();
    $('#main').on('submit','#signInForm',function(e){
       authenticate(e);
    });
    $('#main').on('click', '#addTransaction',function(e) {
        renderTransactionForm();
     });
     $('#main').on('submit','#transForm',function(e) {
        addTransaction(e);
     });
    if (performance.navigation.type == 1) {
        console.info( "This page is reloaded" );
      } else {
        console.info( "This page is not reloaded");
      }


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
            console.log('request failed');
        }
    });
    
}

function renderTransactionForm(){ 
    tempLogin =  $('#loginContent').hide().detach();
    tempTransactions = $('#transactions').hide().detach();
    if (tempLogin){
        login = tempLogin;
    }
    if (tempTransactions){
        transactions = tempTransactions
    }
    $('#main').append(transactionForm);
    $('#transactionForm').show();
}

function renderTransactions(getNewTransactions = true){
    tempLogin =  $('#loginContent').hide().detach();
    tempTransactionForm = $('#transactionForm').hide().detach();
    if (tempLogin){
        login = tempLogin;
    }
    if (tempTransactionForm){
        transactionForm = tempTransactionForm
    }
    $('#main').append(transactions);
    $('.loading').show();
    $('#addTransaction').prop('disabled', true);
    $('#transactions').show();
    if (getNewTransactions){
        getTransactions();
    }

}

function renderLogin(){
    if (getCookie('authToken')){
        renderTransactions();
    }
    else{
        tempTransactions =  $('#transactions').hide().detach();
        tempTransactionForm = $('#transactionForm').hide().detach();
        if (tempTransactions){
            transactions = tempTransactions;
        }
        if (tempTransactionForm){
            transactionForm = tempTransactionForm
        }
        $('#main').append(login);
        $('#loginContent').show();
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



function authenticate(e){
    e.preventDefault();
    e.stopPropagation(); 
    var email = $("#email").val();
    var password =  $("#password").val();
    var url  = "corsproxy.php";
    $.ajax({
        type: 'post',
        url: url,
        data:{ 'url':'https://www.expensify.com/api?command=Authenticate', 'partnerName': 'applicant', 'partnerPassword' : 'd7c3119c6cdab02d68d9', 'partnerUserID': email, 'partnerUserSecret': password },
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
            console.log('request failed');
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
            console.log('request failed');
         }
        });
        return false;
}

function renderTable(data){
    var newRows = "";
    for (var i= 0; i<data.length; i++) {
    newRows += "<tr><td class='column1'>" + data[i].created + "</td><td class='column2'>" + data[i].merchant + "</td><td class='column3'>" + data[i].amount.toString()+ "</td></tr>";
    }
    $("#transactionTableBody tbody").append(newRows, $('.loading').hide());
    $('#addTransaction').prop('disabled', false);
}




});

