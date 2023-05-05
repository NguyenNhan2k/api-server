const cors = require('cors');
const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const dotenv = require('dotenv');
const handlebars = require('express-handlebars');
dotenv.config();

const app = express();
const path = require('path');
const port = process.env.PORT;
const bodyParser = require('body-parser');
const handlebar = require('./helpers/handlebar');
const route = require('./routes');
const { connectDB } = require('./config/connect_database');
const { userName } = require('./middlewares/verifyToken');

require('./middlewares/passport');

app.use(express.static(path.join(__dirname, 'public')));
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: { ...handlebar },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(flash());
app.use(
    session({
        secret: process.env.SECRET_SESSION,
        cookie: { maxAge: 60000 },
    }),
);
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// use routes

route(app);
// Connect database
connectDB();
app.listen(port, () => {
    console.log(`sever listening on port ${port}`);
});
