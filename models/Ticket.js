const mongoose=require('mongoose')

const TicketSchema= mongoose.Schema (
    {
        
         Title: {
            type : String,
            require: false
         },
         TicketNo: {
            type : String,
            require: false
         },
         RaffleId: {
            type : String,
            require: false
         },
         Both: {
            type : Boolean,
            require: false,
            default: false
         },
    },
    {
        timestamps: true
    }
)

const Ticket=mongoose.model('Ticket',TicketSchema)

module.exports = Ticket