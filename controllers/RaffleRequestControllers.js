const DB=require('../models/RaffleRequest')
const multer =require('multer')
const path = require('path')
const fs = require("fs");

exports.AddRaffleRequest= async(req,res)=>{
    try {
        const image=req.files
         const imagePath = `./image/${image[0].filename}`;
         // Read the image file
         const imageBuffer = fs.readFileSync(imagePath);
         
         // Convert the image buffer to a data URI
         const dataURI = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
         const data={
            UserName:req.body.UserName,
            Title:req.body.Title,
            Sponsor:req.body.Sponsor,
            Price:req.body.Price,
            Prize:req.body.Prize,
            StartingDate:req.body.StartingDate,
            DrawDate:req.body.DrawDate,
            ContactEmail:req.body.ContactEmail,
            CoverImg:dataURI
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
exports.GetAllRaffleRequest= async(req,res)=>{
    try {
        
       const data=await DB.find({})
        
       res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}



exports.GetSingleRaffleRequest= async (req,res)=>{
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


exports.UpdateSingleRaffleRequest=async (req,res)=>{
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


exports.DeleteSingleRaffleRequest= async(req,res)=>{
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