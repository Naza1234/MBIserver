const mongoose=require('mongoose')

const RaffleRequestSchema= mongoose.Schema (
    {
        
         UserName: {
            type : String,
            require: false
         },
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
         DrawDate: {
            type : String,
            require: false,
         },
         ContactEmail: {
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

const RaffleRequest=mongoose.model('RaffleRequest',RaffleRequestSchema)

module.exports = RaffleRequest