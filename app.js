const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./db/connect');

const authRouter = require('./routes/auth');
// const serieRouter = require('./routes/serie');
const filmRouter = require('./routes/film');
const metadataRouter = require('./routes/metadata');
const indexRouter = require('./routes/index');

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
app.use('/', indexRouter);
app.use('/auth', authRouter);
// app.use('/serie', serieRouter);
app.use('/film', filmRouter);
app.use('/metadata', metadataRouter);

// 404 handler

app.use((req, res, next) => {
  next(createError(404));
});


app.get('/', (req, res) => {
  res.send(':)')
 });

// Server setup
const PORT = 3001;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor aberto na porta ${PORT}`);
});
