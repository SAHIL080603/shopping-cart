const mongoose=require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const productschema=new mongoose.Schema({
    name:{
        type:String,
    },
    price:Number,
    img:String,
    desc:String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review',
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
})

productschema.plugin(mongoosePaginate);
// productschema.reviews.plugin(mongoosePaginate);

const Product=mongoose.model('Product',productschema);

module.exports=Product;