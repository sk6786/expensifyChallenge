<!DOCTYPE html>
<html lang="en">
<?php header('Access-Control-Allow-Origin: *'); ?>
<head>
    <meta charset="UTF-8">
    <title>Expensify Take-Home Challenge</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
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

    <!-- Javascript Files, we've included JQuery here, feel free to use at your discretion. Add whatever else you may need here too. -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script type="text/javascript" src="script.js"></script>

</body>
</html>
