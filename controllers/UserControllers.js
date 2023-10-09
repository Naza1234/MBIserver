const DB = require('../models/UserDetals');
const SDB=require("../models/Raffle")
const RDB=require("../models/PurchaseTickets")
const TDB=require("../models/Ticket")
const bcrypt = require('bcrypt');


exports.SignupUsers = async (req, res) => {
    try {
        // Check if the email already exists
        const existingUser = await DB.findOne({ UserEmail: req.body.UserEmail });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new user if the email is not in use
        const data = await DB.create(req.body);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.LoginUsers = async (req, res) => {
    try {
        const { UserEmail, UserPassword } = req.body;

        // Find the user by email
        const user = await DB.findOne({ UserEmail });

        if (!user) {
            // If the user is not found, send an error response
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(UserPassword, user.UserPassword);

        if (!passwordMatch) {
            // If the passwords don't match, send an error response
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If email and password are correct, send the user's ID to the frontend
        res.status(200).json({ userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.search = async (req, res) => {
    try {
        const { id } = req.params;
       
        // Search for a raffle where either Title or Sponsor matches the provided id
        const data = await SDB.find({
            $and: [
              {
                $or: [
                  { Title: { $regex: id, $options: 'i' } }, // Case-insensitive search
                  { Sponsor: { $regex: id, $options: 'i' } } // Case-insensitive search
                ]
              },
              { Ended: false }
            ]
          });
    
       

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.tickets = async (req, res) => {
    try {
        const { id } = req.params;

        // Search for purchase tickets where UserID matches the provided id and WinStatuses is true
        const purchaseTickets = await RDB.find({ UserID: id,Approved: true});

        // Extract TicketID and WinStatuses values from the purchase tickets
        const ticketData = purchaseTickets.map((ticket) => ({
            TicketID: ticket.TicketID,
            WinStatuses: ticket.WinStatuses,
        }));

        // Search for tickets where TicketID matches the extracted values
        const tickets = await TDB.find({ _id: { $in: ticketData.map((ticket) => ticket.TicketID) } });

        // Now you can append the WinStatuses value to each ticket in the result
        const ticketsWithWinStatuses = tickets.map((ticket) => ({
            ...ticket.toObject(), // Convert Mongoose document to plain object
            WinStatuses: ticketData.find((data) => data.TicketID === ticket._id.toString())?.WinStatuses || false,
        }));
        res.status(200).json(ticketsWithWinStatuses);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};




  

exports.GetAllUsers= async(req,res)=>{
    try {
        
       const data=await DB.find({})
        
       res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}



exports.GetSingleUsers= async (req,res)=>{
    try {
        const{id}=req.params
        const data=await DB.findById(id)
        
        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}


exports.UpdateSingleUsers=async (req,res)=>{
    try {
        

        const{id}=req.params
        const data=await DB.findByIdAndUpdate(id,req.body)
        
        res.status(200).json(data)


    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}


exports.DeleteSingleUsers= async(req,res)=>{
    try {
        

        const{id}=req.params
        const data=await DB.findByIdAndDelete(id)
        
        res.status(200).json(data)


    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}