var fs = require("fs");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const session = require('express-session')
// 加入這兩行
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 60 * 1000 }
}));


let onlineCount = 0;
let login_status = false; 
//let username = ""
app.use(express.static(__dirname));
app.set('views', __dirname+'/views');
app.engine('html',require('ejs').renderFile)
app.set('view engine','html')
app.use(bodyParser());

app.get('/',(req,res) => {
    //if (login_status==true){
      //  username = app.username;
        //console.log(username);
    //}
    res.render('index.ejs',{
        login : app.login_status,
        user : app.username
    });
});

app.post('/reg',(req,res)=>{
    console.log("post something");
    //req.session.username = req.body.username;
    app.username = req.body.username;
    app.login_status = true;
    //req.session.login_status = true;
    //login_status = true
    res.redirect('/');
    


});

app.get('/living',(req,res)=>{
    res.render('living_page.ejs',{
        login : app.login_status,
        user : app.username
    });
});

app.post('/creat_channel',(req,res)=>{
    var sess = req.session;
    var channel_name = req.body.channel_name;
    fs.mkdir(channel_name,function(err){
        console.log(err);
    })
    res.render('index.ejs',{
        login : app.login_status,
        user : app.username
    });
 
});

app.get('/rtmp/push', function (req, res) {
  console.log('ok push: ' + JSON.stringify(req.query));

});


// 當發生連線事件
io.on('connection', (socket) => {
	onlineCount++;
	socket.emit("login",app.login_status);
	console.log(login_status);
	io.emit("online",onlineCount);
    console.log('Hello!');  // 顯示 Hello!
    
 	socket.on("greet",() => {
 		socket.emit("greet",onlineCount)
 	})
 	socket.on("send", (msg) => {
        console.log(msg)
        //if (Object.keys(msg).length < 2) return;
 		msg.name = app.username;
        // 廣播訊息到聊天室
        io.emit("msg", msg);
    });
    // 當發生離線事件
    socket.on('disconnect', () => {
    	onlineCount = (onlineCount<0) ? 0:onlineCount-=1;
    	io.emit("online",onlineCount);

        console.log('Bye~');  // 顯示 bye~
    });
    //console.log(onlineCount)
});
 
// 注意，這邊的 server 原本是 app
server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});