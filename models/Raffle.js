const mongoose=require('mongoose')

const RaffleSchema= mongoose.Schema (
    {
        
         Title: {
            type : String,
            require: false
         },
         Sponsor: {
            type : String,
            require: false
         },
         Price: {
            type : String,
            require: false
         },
         Prize: {
            type : String,
            require: false,
         },
         StartingDate: {
            type : String,
            require: false,
         },
         Ended: {
            type : Boolean,
            require: false,
            default:false
         },
         DrawDate: {
            type : String,
            require: false,
         },
         CoverImg: {
            type : String,
            require: false,
         },
    },
    {
        timestamps: true
    }
)

const Raffle=mongoose.model('Raffle',RaffleSchema)

module.exports = Raffle