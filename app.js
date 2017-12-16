const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const port = 5000;

const ideas = require('./routes/ideas');
const users = require('./routes/users');

require('./config/passport')(passport);

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/p1', {
	useMongoClient: true
})
.then(() => console.log('mongoDB connected...'))
.catch(err => console.log(err));



// Express handlebars
app.engine('handlebars', exphbs(
	{
		defaultLayout: 'main'
	}
));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));


// session
app.use(session({
	secret: 'psychotherapist',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Init
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

// Routes
app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', {
		'title' : title
	});
});
app.get('/about', (req, res) => {
	res.render('about');
});



app.use('/ideas', ideas);
app.use('/users', users);