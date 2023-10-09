const mongoose=require('mongoose')

const PaymentGateWaySchema= mongoose.Schema (
    {
        
         BankName: {
            type : String,
            require: false
         },
         AccountNo: {
            type : String,
            require: false
         },
         AccountName: {
            type : String,
            require: false
         },
    },
    {
        timestamps: true
    }
)

const PaymentGateWay=mongoose.model('PaymentGateWay',PaymentGateWaySchema)

module.exports = PaymentGateWay