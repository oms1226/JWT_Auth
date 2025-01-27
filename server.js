var express = require('express');
var app=express();
var bodyParser= require('body-parser');
var jwt=require('jsonwebtoken');

var users=[
{
  name:"user00",
  password:"xxxx"
},
{
  name:"user01",
  password:"yyyy"
}
]
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('./'));

app.get('/', (req,res)=>{
    res.sendFile('index.html');
});

app.post('/login',(req,res)=>{
    console.log("/login");
    var message;
    for(var user of users){
      if(user.name!=req.body.name){
          message="Wrong Name";
      }else{
          if(user.password!=req.body.password){
              message="Wrong Password";
              break;
          }
          else{
              user.exp = Math.floor(Date.now() / 1000) + 30;
              var token=jwt.sign(user,"samplesecret");
              console.log(token);
              message="Login Successful";
              break;
          }
      }
    }
    if(token){
        res.status(200).json({
            message,
            token
        });
    }
    else{
        res.status(403).json({
            message
        });
    }
    console.log("/login --> " + message);
});

app.use((req, res, next)=>{
        // check header or url parameters or post parameters for token
        console.log(req.body);
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if(token){
          console.log("token verify");
          jwt.verify(token,"samplesecret",(err,decod)=>{
            if(err){
              console.log(err);
              res.status(403).json({
                message:"Wrong Token"
              });
            }
            else{
              console.log("success");
              req.decoded=decod;
              //next();
              res.status(200).json({
                message:"Correct Token"
              });
            }
          });
        }
        else{
          res.status(403).json({
            message:"No Token"
          });
        }
});

app.post('/getusers',(req,res)=>{
    var user_list=[];
    console.log("here");
    users.forEach((user)=>{
        user_list.push({"name":user.name});
    })
    res.send(JSON.stringify({users:user_list}));
});

app.listen(3000, function(){
  console.log('listening on port 3000');
});
