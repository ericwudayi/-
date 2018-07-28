var express = require('express');
var app     = express();
var port    = process.env.PORT || 8080;


//載入MySQL模組
var mysql = require('mysql');
//建立連線
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'aannss456',
    database: 'streaming'
});


// connection.connect();


app.get('/sample', function(req, res) {

    var query = 'SELECT a.token,a.create_time,b.name FROM room a INNER JOIN user b on a.user_id = b.id ORDER BY a.create_time'    

    connection.query(query,function(error, rows, fields){

        if(error){
            throw error;
        }
        console.log(rows);
        
    });

});


// //});

//     router.get('/:userName', function(req, res) {
//         var userName = req.params.userName;
//         var query = 'SELECT a.token,a.create_time,b.name FROM room a INNER JOIN user b on a.user_id = b.id where b.name like \'%'+userName+'%\' ORDER BY a.create_time'
//     });




// connection.end();


//docker run --name mysql -e MYSQL_ROOT_PASSWORD=MY_PASSWORD -p 127.0.0.1:3306:3306 -d mysql/mysql-server:5.7
