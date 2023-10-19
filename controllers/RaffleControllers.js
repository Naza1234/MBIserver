const DB=require('../models/Raffle')
const TDB=require('../models/Ticket')
const multer =require('multer')
const path = require('path')
const fs = require("fs");

exports.AddRaffle= async(req,res)=>{
    try {
        const image=req.files
         const imagePath = `./image/${image[0].filename}`;
         // Read the image file
         const imageBuffer = fs.readFileSync(imagePath);
         
         // Convert the image buffer to a data URI
         const dataURI = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
         const data={
            Title:req.body.Title,
            Sponsor:req.body.Sponsor,
            Price:req.body.Price,
            Prize:req.body.Prize,
            StartingDate:req.body.StartingDate,
            DrawDate:req.body.DrawDate,
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


exports.GetAllTicket = async (req, res) => {
    try {
        const{id}= req.params;
        const  RaffleId =id 

        const data = await TDB.find({ RaffleId: RaffleId, Both: false });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.GetAllTicketBoth = async (req, res) => {
    try {
        const{id}= req.params;
        const  RaffleId =id 

        const data = await TDB.find({ RaffleId: RaffleId, Both: true });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


exports.GetAllRaffle= async(req,res)=>{
    try {
        
       const data=await DB.find({})
        
       res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}



exports.GetSingleRaffle= async (req,res)=>{
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


exports.UpdateSingleRaffle=async (req,res)=>{
    try {
        const { id } = req.params;
        const updatedData = req.body;
    
        // Use the findByIdAndUpdate method to update the document by ID
        const data = await DB.findByIdAndUpdate(id, updatedData, { new: true });
    
        if (!data) {
            return res.status(404).json({ message: 'Document not found' });
        }
    
        res.status(200).json({data,updatedData});
    } catch (error) {
        res.status(500).json({
            message:error.message
          }) 
    }
}


exports.DeleteSingleRaffle= async(req,res)=>{
    exports.DeleteRaffle = async (req, res) => {
        try {
            const { id } = req.params;
    
            // Step 1: Find the raffle with the provided id
            const raffleToDelete = await DB.findById(id);
    
            if (!raffleToDelete) {
                return res.status(404).json({
                    message: 'Raffle not found',
                });
            }
    
            // Step 2: Delete the found raffle
            await DB.findByIdAndDelete(id);
    
            // Step 3: Find all tickets with matching RaffleId
            const ticketsToDelete = await TDB.find({ RaffleId: id });
    
            // Step 4: Delete the found tickets
            const deletedTickets = await TDB.deleteMany({ RaffleId: id });
    
            // After deletion, you can respond with information about deleted raffle and tickets
            res.status(200).json({
                message: 'Raffle and associated tickets deleted successfully',
                deletedRaffle: raffleToDelete,
                deletedTickets,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    };
    
}