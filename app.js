const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./db/connect');

const authRouter = require('./routes/auth');
const serieRouter = require('./routes/serie');
const metadataRouter = require('./routes/metadata');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRouter);
app.use('/serie', serieRouter);
app.use('/metadata', metadataRouter);

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Server setup
const PORT = 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor aberto na porta ${PORT}`);
});
