const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const route = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const handlebars = require('express-handlebars');
const { connectDB } = require('./config/connect_database');
const app = express();
dotenv.config();
const port = process.env.PORT;

//
app.use(express.static(path.join(__dirname, 'public')));
// Template Engine Handlebar
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

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
