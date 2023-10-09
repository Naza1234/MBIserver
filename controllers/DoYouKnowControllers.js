const DB=require('../models/DoYouKnow')
const TDB=require('../models/Ticket')
const multer =require('multer')
const path = require('path')
const fs = require("fs");
exports.AddDoYouKnow= async(req,res)=>{
    try {
        const image=req.files
         const imagePath = `./image/${image[0].filename}`;
         // Read the image file
         const imageBuffer = fs.readFileSync(imagePath);
         
         // Convert the image buffer to a data URI
         const dataURI = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
         const data={
            Details:req.body.Details,
            CoverImg:dataURI
            }
            
          const dataBody= await DB.create(data)
         res.status(200).json(dataBody)
      
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
exports.GetAllDoYouKnow = async (req, res) => {
    try {
        const dataCount = await DB.countDocuments();
        
        let query = DB.find({});
        
        if (dataCount > 10) {
            // If there are more than 10 documents, limit to the 10 most recent
            query = query.sort({ createdAt: -1 }).limit(10);
        }

        const data = await query.exec();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};




exports.GetSingleDoYouKnow= async (req,res)=>{
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


exports.UpdateSingleDoYouKnow=async (req,res)=>{
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


exports.DeleteSingleDoYouKnow= async(req,res)=>{
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