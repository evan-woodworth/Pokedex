require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(methodOverride('_method'))
app.use(session({
  //What we will be giving the user on our site as a session cookie
  secret: SECRET_SESSION,
  //Don't save the session when it's modified
  resave: false,
  //Save a new session
  saveUninitialized: true
}));
app.use(passport.initialize()); //Initialize passport
app.use(passport.session()); //add a session
//flash middleware
app.use(flash());
//store flash messages and user on res.locals
app.use((req,res,next)=>{
  console.log('---------------------');
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get();
  res.render('profile', { id, name, email });
});

app.use('/auth', require('./controllers/auth'));
app.use('/games', require('./controllers/games'));
app.use('/moves', require('./controllers/moves'));
app.use('/pokemon', require('./controllers/pokemon'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
