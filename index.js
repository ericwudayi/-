import * as sql from './mysql/index.js'
var fs = require("fs");
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const session = require('express-session')
var SSE = require('sse-nodejs');

// 加入這兩行
const server = require('http').Server(app);
const io = require('socket.io')(server,{'pingInterval': 2000, 'pingTimeout': 5000});
app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 600 * 1000 }
}));


//let onlineCount = 0;
//let maxPrice = 1 
var roomInfo = {};

app.use(express.static(__dirname));
app.set('views', __dirname+'/views');
app.engine('html',require('ejs').renderFile)
app.set('view engine','html')

app.use(bodyParser());

app.get('/',(req,res) => {

	res.render('index.ejs',{
		login : req.session.login_status,
		user : req.session.user,
		Allrooms : JSON.stringify(roomInfo)
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

app.get('/living/:roomID',(req,res)=>{
	console.log("login:" + req.session.login_status);
	var roomID = req.params.roomID;
	res.render('living_page.ejs',{
		login : req.session.login_status,
		user : req.session.user,
		Allrooms: JSON.stringify(roomInfo)
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
	var roomID = req.body.channel_name;
	//fs.mkdir(channel_name,function(err){
	//	console.log(err);
	//});
	if (!roomInfo[roomID]) {
		console.log("New room");
		var onlineCount = 0;
		var maxPrice = 0;
		var priceName = "None";
	    roomInfo[roomID] = {};
	    roomInfo[roomID].roomid = roomID;
	    roomInfo[roomID].onlineCount = onlineCount;
	    roomInfo[roomID].maxPrice = maxPrice;
	    roomInfo[roomID].priceName = priceName;
	}
    
    
    //Allrooms.push(roomInfo[roomID].roomid);
   
    //console.log(Allrooms);
	res.render('index.ejs',{
		login : sess.login_status,
		user : sess.user,
		Allrooms: JSON.stringify(roomInfo)
	});
 
});

app.get('/rtmp/push', function (req, res) {
  console.log('ok push: ' + JSON.stringify(req.query));

});


// 當發生連線事件

io.on('connection', (socket) => {


	var url = socket.request.headers.referer;
  	var splited = url.split('/');
  	var roomID = splited[splited.length - 1];   // 获取房间ID
  	console.log(roomID);
	//onlineCount++;
	//maxPrice = 0;
	//priceName = "None";
	

	socket.on("join",()=>{
		socket.join(roomID);
		console.log("join");
		if (!roomInfo[roomID]) {
		  console.log("New room");
		  var onlineCount = 0;
		  var maxPrice = 0;
		  var priceName = "None";
	      roomInfo[roomID] = {};
	      roomInfo[roomID].onlineCount = onlineCount;
	      roomInfo[roomID].maxPrice = maxPrice;
	      roomInfo[roomID].priceName = priceName;
	    }
	    
	 
	    socket.join(roomID);    // 加入房间
	    // 通知房间内人员
	    roomInfo[roomID].onlineCount =roomInfo[roomID].onlineCount+1; 
	    io.to(roomID).emit("online",roomInfo[roomID].onlineCount);
	    socket.emit("compare", {name:roomInfo[roomID].priceName,msg:roomInfo[roomID].maxPrice});
		//socket.emit("greet",roomInfo[roomID].onlineCount);

	});

	console.log('Hello!');  // 顯示 Hello!
	
	//socket.on("greet",() => {
	//	socket.emit("compare", {name:roomInfo[roomID].priceName,msg:roomInfo[roomID].maxPrice});
	//	socket.emit("greet",roomInfo[roomID].onlineCount)
	//})

	socket.on("send", (msg) => {
		console.log(msg);
		//if (Object.keys(msg).length < 2) return;
		//msg.name = name;

		// 廣播訊息到聊天室
		io.to(roomID).emit("msg", msg);
	});

	socket.on("price",(msg)=>{
		console.log(msg);
		//console.log(roomID);
		//console.log(roomInfo[roomID]);
		if((Object.values(msg)[1]>=0)&&(Object.values(msg)[1]<=10000))
		{	
			if(Object.values(msg)[1]>roomInfo[roomID].maxPrice)
			{   
				roomInfo[roomID].maxPrice = Object.values(msg)[1];
				roomInfo[roomID].priceName = Object.values(msg)[0];
				io.to(roomID).emit("compare", msg);
			}
		}
	});


	// 當發生離線事件
	socket.on('disconnect', () => {
		if (roomInfo[roomID].onlineCount<0){
			roomInfo[roomID].onlineCount=0;
		}
		else
			roomInfo[roomID].onlineCount = roomInfo[roomID].onlineCount-1;
		io.to(roomID).emit("online",roomInfo[roomID].onlineCount);
		socket.leave(roomID);

		console.log('Bye~');  // 顯示 bye~
	});
	//console.log(onlineCount)
});
 
// 注意，這邊的 server 原本是 app
server.listen(3000, () => {
	console.log("Server Started. http://localhost:3000");
});