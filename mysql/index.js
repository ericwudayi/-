var express = require('express');
var app     = express();
var port    = process.env.PORT || 8080;


function getRoom(roomID) {

    var mysql = require('mysql');

    var connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'aannss456',
        database: 'streaming'
    });

    var query = 'SELECT a.token,a.create_time,b.name FROM room a INNER JOIN user b on a.user_id = b.id WHERE 1 '
    if(roomID!=null){
        query += 'AND b.name like \'%'+roomID+'%\' '
    }
    query += ' ORDER BY a.create_time';    

    connection.connect();
    connection.query(query,function(error, rows, fields){

        if(error){
            throw error;
        }
        return rows;
        
    });

    connection.end();
}


function startStreaming(userID,userToken){

    var mysql = require('mysql');
    var dt = new Date();
    var token = Math.random().toString(36).substr(2)+dt.getTime()

    var connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'aannss456',
        database: 'streaming'
    });

    var query = 'INSERT INTO room(\'user_id\', \'token\', \`create_time\`) VALUES (';
    query += '\''+userID+'\',\''+token+'\',\''+new Date().toISOString().slice(0, 19).replace('T', ' ')+'\')';    

    connection.connect();
    connection.query(query,function(error, rows, fields){

        if(error){
            throw error;
        }
        return rows;
        
    });

    connection.end();

}
