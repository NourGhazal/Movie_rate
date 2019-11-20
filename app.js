var express = require('express');
var path = require('path');
//require zy import
var fs = require('fs');
//fs dh file system 3lsan n3rf nsta5dm json
//it saves and reads from system
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//___________________________________________________________
var f = false;
var login = false;
app.get('/',function(req,res){
  if(login){
    res.render('home')
  }
  else{
    res.redirect('login')
  }
})
app.get('/login', function(req, res) {
  if(f){
    res.render('registraionsuccessful')
    f=false;
  }
  else
  {
  res.render('login');
}

});
app.get('/registration',function(req,res){
  res.render('registration')
})
let loaduser = function(){
  try {
      let bufferedData = fs.readFileSync('info.json')
      let dataString = bufferedData.toString()
      let userarray = JSON.parse(dataString)
      return userarray
  } catch (error) {
      return []
  }
 
}

let adduser = function(user){
 let users = loaduser()
 let flag =true
 for(i in users){
    if(users[i].username === user.username){
    // console.log('false')
      flag=false
     
    }

 }
 if(flag){
   users.push(user)
   fs.writeFileSync('info.json', JSON.stringify(users))
   
 }
 return flag 
}
app.post('/register',function(req,res)
{
  let username1 = req.body.username
  let password1 = req.body.password
  user ={
    username : username1,
    password : password1
  }
  if(adduser(user)){
    //  res.render('registraionsuccessful')
    f=true; 
    res.redirect('/login')
  }
  else{
    res.render('registraionfailed')
   }

}
)


/*var myobj = {
  name:'Ali',
  age:25
};
console.log(myobj);
var j = JSON.stringify(myobj);
console.log(j);
fs.writeFileSync('aaa.json',j);
//el func elly fo2 dy bta5od esm el file w el text w tsave el text feh
var e = fs.readFileSync("aaa.json");
var obj = JSON.parse(e);
console.log(e);
console.log(obj);*/
app.listen(3500);
//_______________________________________________________________

module.exports = app;
