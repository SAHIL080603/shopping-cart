const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    // username:{
    //     type:String,
    //     unique:true,
    // },
    // password:String,

    //the above two fileds are automatically added by passport local no need to add yourself

    email:String,
    cart: [
        {   
            _id:false,
            name: String,
            price: Number,
            img: String,
            id: mongoose.Schema.Types.ObjectId,
            count: {
                type: Number,
                default: 1,
                min: [1, 'Quantity Cannot be less than 1']
            }
        }
    ],
    userType:{
        type:String,
        enum:['consumer','retailer'],
        default:'consumer',
    },
    officeAddress:String,
    telephone:String,
    mobile:{
        countryid:String,
        number:Number,
    },
    instagramid:String,
    twitterid:String,
    facebookid:String,
    likedProducts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model('User',userSchema);

module.exports=User;