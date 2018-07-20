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
let maxPrice = 1 
app.use(express.static(__dirname));
app.set('views', __dirname+'/views');
app.engine('html',require('ejs').renderFile)
app.set('view engine','html')
app.use(bodyParser());

app.get('/',(req,res) => {

    res.render('index.ejs',{
        login : req.session.login_status,
        user : req.session.user
    });
});

app.post('/reg',(req,res)=>{
    console.log("post something");
    console.log('body: ' + JSON.stringify(req.body));
    req.session.user = req.body.username;
    req.session.login_status = true;
    //login_status = true
    console.log(req.session.login_status);
    res.redirect('/');
});

app.get('/living',(req,res)=>{
    res.render('living_page.ejs',{
        login : req.session.login_status,
        user : req.session.user
    });
});

app.get('/registration',(req,res)=>{
    res.render('registration.html');
});

app.get('/login',(req,res)=>{
    res.render('login.html');
});

app.get('/profile',(req,res)=>{
    res.render('profile.html');
});

app.get('/creatChannel',(req,res)=>{
    res.render('creat_channel.html');
});


app.post('/creat_channel',(req,res)=>{
    var sess = req.session;
    var channel_name = req.body.channel_name;
    fs.mkdir(channel_name,function(err){
        console.log(err);
    })
    res.render('index.ejs',{
        login : sess.login_status,
        user : sess.user
    });
 
});

app.get('/rtmp/push', function (req, res) {
  console.log('ok push: ' + JSON.stringify(req.query));

});


// 當發生連線事件
io.on('connection', (socket) => {
	onlineCount++;
	maxPrice = 0;
    io.emit("compare", {name:"None",msg:maxPrice});
	io.emit("online",onlineCount);
    console.log('Hello!');  // 顯示 Hello!
    
 	socket.on("greet",() => {
 		socket.emit("greet",onlineCount)
 	})
 	socket.on("send", (msg) => {
        console.log(msg);
        //if (Object.keys(msg).length < 2) return;
 		//msg.name = name;

        // 廣播訊息到聊天室
        io.emit("msg", msg);
    });

    socket.on("price",(msg)=>{
        console.log(msg);
        if((Object.values(msg)[1]>=0)&&(Object.values(msg)[1]<=999))
        {
            if(Object.values(msg)[1]>maxPrice)
            {   
                maxPrice = Object.values(msg)[1];
                io.emit("compare", msg);
            }
        }
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