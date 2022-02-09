const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const {Transaction} = require('./schemas/transaction');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: require('find-config')('.env') })


const app = express();
app.use(cors());
app.options('*', cors())

const api = process.env.API_URL;

//Transaction Router
const transactionRouter = require("./routers/transactionRouter");

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(fileUpload());

//Routers
app.use(`${api}/transactions`, transactionRouter)

mongoose.connect(process.env.MONGO_CONNECTION)
.then(() => {
    console.log("Connected to database");
})
.catch((err) => {
    console.log(err)
})

app.listen(3000, ()=> {
    //console.log(api);
    console.log('Server is running http://localhost:3000');
})