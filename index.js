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
let username = ""
app.use(express.static(__dirname));
app.set('views', __dirname+'/views');
app.engine('html',require('ejs').renderFile)
app.set('view engine','html')
app.use(bodyParser());

app.get('/',(req,res) => {
    if (login_status==true){
        username = req.session.username;
        console.log(username);
    }
    res.render('index.html',{
        login : login_status,
        user : username
    });
});

app.post('/reg',(req,res)=>{
    console.log("post something");
    req.session.username = req.body.username;
    req.session.login_status = true;
    login_status = true
    res.redirect('/');
    


});

app.get('/living',(req,res)=>{
    res.render('index3.ejs',{
        login : login_status,
        user : username
    });
});
// 當發生連線事件
io.on('connection', (socket) => {
	onlineCount++;
	socket.emit("login",login_status);
	console.log(login_status);
	io.emit("online",onlineCount);
    console.log('Hello!');  // 顯示 Hello!
    
 	socket.on("greet",() => {
 		socket.emit("greet",onlineCount)
 	})
 	socket.on("send", (msg) => {
        console.log(msg)
        //if (Object.keys(msg).length < 2) return;
 		msg.name = "遊客";
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