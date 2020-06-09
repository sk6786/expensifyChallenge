<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Expensify Take-Home Challenge</title>
    <link rel="stylesheet" type="text/css" href="styles.css" rel="preload" as="css">
</head>
<body id='main'>
    <div id="loginContent">
        <?php include 'login.html';?>
    </div>
    <div id="transactions">
         <?php include 'transactionTable.html';?> 
        
    </div>

    <div id="transactionForm">
        <?php include 'transactionForm.html';?>
    </div> 
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js" rel="preconnect"></script>
    <script type="text/javascript" src="script.js" rel="preload" as="script"></script>

</body>
</html>
