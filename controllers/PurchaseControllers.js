const DB=require('../models/PurchaseTickets')
const multer =require('multer')
const path = require('path')
const fs = require("fs");

exports.AddPurchaseTickets= async(req,res)=>{
    try {
         
        const image=req.files
         const imagePath = `./image/${image[0].filename}`;
         // Read the image file
         const imageBuffer = fs.readFileSync(imagePath);
         
         // Convert the image buffer to a data URI
         const dataURI = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
         const data={
            UserID:req.body.UserID,
            TicketID:req.body.TicketID,
            PaymentID:req.body.PaymentID,
            WinStatuses:req.body.WinStatuses,
            Approved:req.body.Approved,
            ProofImg:dataURI
            }
            
             await DB.create(data)
         res.status(200).json(data)
      
    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}
const fileStorage=multer.diskStorage({
    destination: (req,file,cd) =>{
        cd(null,'image')
    },
    filename: (req, file, cd)=>{
        cd(null,Date.now() + path.extname(file.originalname))
    }
})
exports.uplaod=multer({
    storage:fileStorage,
     limits:{fileSize: '10000000'},
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ['png', 'jpg', 'jpeg', 'jpg']
        if (!(acceptableExtensions.some(extension => 
            path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension not allowed, accepted extensions are ${acceptableExtensions.join(',')}`))
        }
        callback(null, true)
    }
}).any()
exports.GetAllPurchaseTickets = async (req, res) => {
    try {
      // Query the database to find records where Approved is false
      const data = await DB.find({ Approved: false });
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
  


exports.GetSinglePurchaseTickets= async (req,res)=>{
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


exports.UpdateSinglePurchaseTickets=async (req,res)=>{
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


exports.DeleteSinglePurchaseTickets= async(req,res)=>{
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