const mongoose=require('mongoose')

const PurchaseTicketsSchema= mongoose.Schema (
    {
        
         UserID: {
            type : String,
            require: false
         },
         TicketID: {
            type : String,
            require: false
         },
         PaymentID: {
            type : String,
            require: false
         },
         ProofImg: {
            type : String,
            require: false
         },
         WinStatuses: {
            type : String,
            require: false,
            default: "Inprogress"
         },
         Approved: {
            type : Boolean,
            require: false,
            default: false
         },
    },
    {
        timestamps: true
    }
)

const PurchaseTickets=mongoose.model('PurchaseTickets',PurchaseTicketsSchema)

module.exports = PurchaseTickets