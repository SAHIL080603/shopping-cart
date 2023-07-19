const mongoose=require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const reviewSchema=new mongoose.Schema({
    author:{
        name:String,
        userid:mongoose.Schema.Types.ObjectId,
    },
    rating:Number,
    comment:String,
})

reviewSchema.plugin(mongoosePaginate);

const Review=mongoose.model('Review',reviewSchema);

module.exports=Review;