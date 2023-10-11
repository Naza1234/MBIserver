const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const cors = require('cors');



const corsOptions = {
    origin: 'https://www.mbiworld.online', // Allow requests from this specific URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/image",express.static("./image"))




    // All Routes in this API

    const UserRoute = require("./routes/UserRoute");
    app.use("/user",UserRoute)  
   
    const PurchaseTicketRoute = require("./routes/PurchaseTicketsRoutes");
    app.use("/PurchaseTicket",PurchaseTicketRoute)  
   
   
    const RaffleRequestRoute = require("./routes/RaffleRequestRoute");
    app.use("/RaffleRequest",RaffleRequestRoute)  
   
    const RaffleRoute = require("./routes/RaffleRoute");
    app.use("/Raffle",RaffleRoute) 

    const DoYouKnowRoute = require("./routes/DoYouKnowRoute");
    app.use("/DoYouKnow",DoYouKnowRoute)  
   
    const TicketRoute = require("./routes/TicketRoute");
    app.use("/Ticket",TicketRoute)  
   
    const PaymentGateWayRoute = require("./routes/PaymentGateWayRoute");
    app.use("/PaymentGateWay",PaymentGateWayRoute)  
   
    const emailRoute = require("./routes/emailrout");
    app.use("/email",emailRoute)  
   


// data base connection

const url="mongodb+srv://Rafflewebsite:Nazatech@cluster0.ldfygeh.mongodb.net/?retryWrites=true&w=majority"

const port=3000



mongoose
.connect(url)
.then(()=>{
    console.log('since with database made');
    app.listen(port,()=>{
        console.log(`server is now running on ${port} `);
    })
}).catch((error)=>{
    console.log(error.message);
})
