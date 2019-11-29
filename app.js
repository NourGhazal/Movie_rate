var express = require('express');
var session = require('express-session');
var path = require('path');
//require zy import
var fs = require('fs');
//const session = require('express-session');
//fs dh file system 3lsan n3rf nsta5dm json
//it saves and reads from system
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'weareengineers',
saveUninitialized: false,
resave: false
}));
//___________________________________________________________
// ->>>>>>>>> var sess; // yasta global session NOT recommended
var flagreg = false;

var flaglog = false;

const movies = ['dark knight','conjuring','fight club','god father','god father2', 'scream'];
fs.writeFileSync('movies.json', JSON.stringify(movies))

app.get('/',function(req,res){
  if(req.session.login && flaglog){
    res.render('homes')
    flaglog=false
  }
  else{
    if(req.session.login){
      res.render('home')
    }
    else{
    res.redirect('login')
  }
  }
})
app.get('/login', function(req, res) {
  
  if(flagreg){
    res.render('registraionsuccessful')
    flagreg=false;
  }
  else
  {
  res.render('login');
}

});
app.get('/registration',function(req,res){
  res.render('registration')
})
app.post('/register',function(req,res)
{
  let username1 = req.body.username
  let password1 = req.body.password
  if(!(username1 === '' || password1 === '')){
  user ={
    username : username1,
    password : password1
  }
  if(adduser(user)){
    //  res.render('registraionsuccessful')
    flagreg=true; 
    res.redirect('/login')
  }
  else{
    res.render('registraionfailed')
   }
  }
else{
  res.render('registraionfailed')
}
}
)
app.post('/login',function(req,res){
  username1 = req.body.username
  password1 = req.body.password 
    
  var user ={ username:username1 , password:password1}
  if(checkuser(user)){
    flaglog = true
    req.session.login = true
    req.session.username = user.username
   
    res.redirect('/')
  }
  else{
    res.render('loginfail')
  }

})

app.get('/drama',function(req,res){
  if(req.session.login)
  res.render('drama')
  else
  res.redirect('/login')
})

app.get('/horror',function(req,res){
  if(req.session.login)
  res.render('horror')
  else
  res.redirect('/login')
})

app.get('/action',function(req,res){
  if(req.session.login)
  res.render('action')
  else
  res.redirect('/login')
})

app.get('/watchlist',function(req,res){
  mywatchlists = getwatchlist();
  data =[];
  for(i in mywatchlists){
    if(mywatchlists[i].user === req.session.username){
      movie = mywatchlists[i].movie.replace(' ','');
      data.push(movie);
    }
  }
  if(req.session.login)
  res.render('watchlist', {watchlists: data })
  else
  res.redirect('/login')
})

app.get('/godfather',function(req,res){
  if(req.session.login)
  res.render('godfather')
  else
  res.redirect('/login')
})

app.get('/godfather2',function(req,res){
  if(req.session.login)
  res.render('godfather2')
  else
  res.redirect('/login')
})

app.get('/conjuring',function(req,res){
  if(req.session.login)
  res.render('conjuring')
  else
  res.redirect('/login')
})

app.get('/darkknight',function(req,res){
  if(req.session.login)
  res.render('darkknight')
  else
  res.redirect('/login')
})

app.get('/fightclub',function(req,res){
  if(req.sessionlogin)
  res.render('fightclub')
  else
  res.redirect('/login')
})

app.get('/godfather',function(req,res){
  if(req.session.login)
  res.render('godfather')
  else
  res.redirect('/login')
})

app.get('/scream',function(req,res){
  if(req.session.login)
  res.render('scream')
  else
  res.redirect('/login')
})
app.get('/searchresults',function(req,res){
  if(req.session.login)
  res.render('searchresults')
  else
  res.redirect('/login')
})
app.post('/search',function(req,res){
  let word = req.body.Search;
  if(word === ''){
    res.render('nosearch')
  }else{
  let display = search(word);
  if(display.length===0)
      res.render('notfound')
     else 
  res.render('searchresults',{movie : display})}
})
app.post('/darkknight',function(req,res){
  towatchlist = {
    movie: 'dark knight'
    ,user : req.session.username
  }
   if(!addtowatchlist(towatchlist))
     res.render('dwe');
 else
   res.render('darkknight');
 
 })
 app.post('/conjuring',function(req,res){
  towatchlist = {
    movie: 'conjuring'
    ,user : req.session.username
  }
   if(!addtowatchlist(towatchlist))
     res.render('cwe');
 else
   res.render('conjuring');
 
 })
 app.post('/fightclub',function(req,res){
  towatchlist = {
    movie: 'fight club'
    ,user : req.session.username
  }
   if(!addtowatchlist(towatchlist))
     res.render('fcwe');
  else
   res.render('fightclub');
 
 })
 app.post('/godfather',function(req,res){
  towatchlist = {
    movie: 'god father'
    ,user : req.session.username
  }
   if(!addtowatchlist(towatchlist))
     res.render('gfwe');
    else
   res.render('godfather');
 
 })
 app.post('/godfather2',function(req,res){
  towatchlist = {
    movie: 'god father2'
    ,user : req.session.username
  }
   if(!addtowatchlist(towatchlist))
     res.render('gfwe2');
  else
   res.render('godfather2');
 
 })
 app.post('/scream',function(req,res){
 towatchlist = {
   movie: 'scream'
   ,user : req.session.username
 }
  if(!addtowatchlist(towatchlist))
    res.render('swe');
  else
  res.render('scream');

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

let checkuser = function(user){
let users = loaduser()
let flag = false
for(i in users){
  if((users[i].username === user.username) && (users[i].password===user.password) ) {
    flag=true
  }

}
return flag
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
} ;

let search = function(movie){
  let ourmovies = getmovies();
let  display= [];
  for(i in ourmovies){
      if(ourmovies[i].includes(movie)){
      ourmovies[i] = ourmovies[i].replace(' ','');
      
        //console.log(ourmovies[i])
        display.push(ourmovies[i]);
        
      }
      
  }
  //console.log(display);
  
return display
} ;

let getmovies = function(){
  try {
      let bufferedData = fs.readFileSync('movies.json')
      let dataString = bufferedData.toString()
      let movies = JSON.parse(dataString)
      return movies
  } catch (error) {
      return []
  }
 
}

let getwatchlist = function(){
  try {
      let bufferedData = fs.readFileSync('watchlists.json')
      let dataString = bufferedData.toString()
      let watchlist = JSON.parse(dataString)
      return watchlist
  } catch (error) {
      return []
  }
 
}
let addtowatchlist = function(watchlist){
  let watchlists = getwatchlist()
  let flag =true
  for(i in watchlists){
     if(watchlists[i].user === watchlist.user && watchlists[i].movie ===watchlist.movie ){
     // console.log('false')
       flag=false
      
     }
 
  }
  if(flag){
    watchlists.push(watchlist)
    fs.writeFileSync('watchlists.json', JSON.stringify(watchlists))
    
  }
  return flag 
 } ;

app.listen(3500);
//_______________________________________________________________

module.exports = app;
