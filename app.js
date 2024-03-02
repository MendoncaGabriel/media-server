const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./db/connect');


const authRouter = require('./routes/auth.router');
const adminRouter = require('./routes/admin.router');
const filmRouter = require('./routes/film.router');
const metadataRouter = require('./routes/metadata.router');
const homeRouter = require('./routes/home.router');
const playerRouter = require('./routes/player.router')
const serieRouter = require('./routes/serie.router')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, 'components')));




// Routes
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/player', playerRouter);
app.use('/admin', adminRouter);
app.use('/film', filmRouter);
app.use('/metadata', metadataRouter);
app.use('/serie', serieRouter);




// Server setup
const PORT = 80;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor aberto na porta ${PORT}`);
});
