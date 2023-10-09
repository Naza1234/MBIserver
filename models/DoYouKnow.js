const mongoose=require('mongoose')

const DoYouKnowSchema= mongoose.Schema (
    {
        
        CoverImg: {
            type : String,
            require: false
         },
         Details: {
            type : String,
            require: false
         },
    },
    {
        timestamps: true
    }
)

const DoYouKnow=mongoose.model('DoYouKnow',DoYouKnowSchema)

module.exports = DoYouKnow