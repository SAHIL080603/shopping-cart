const express=require('express')
const router =express.Router();
const Product=require('../models/Product');
const Review=require('../models/Review.js');
const User=require('../models/User');
const {isLoggedIn}=require('../middelware');

router.post('/products/:productid/review',isLoggedIn,async (req,res)=>{
    const {productid}=req.params;
    const {rating,comment}=req.body;
    const {username}=req.user;
    const id=req.user._id;
    try{
        

        if(!comment.trim()){
            req.flash('error','cannot submit blank review');
        }else if(rating<=0){
            req.flash('error','give at least 1 star rating to submit review');
        }else{
            const product=await Product.findById(productid);     //find the product

            const review=await Review.create({
                author:{
                    name:username,
                    userid:id,
                },
                rating:rating,
                comment:comment
            });       //create review

            product.reviews.unshift(review._id);                       //store review id in product review array

            // console.log(review);

            await product.save();  

            req.flash('success','review submitted successfully');
        }   
    }catch(e){
        req.flash('error',e.message);
    }

    res.redirect(`/products/${productid}`);
})

router.patch('/products/:productid/review/:reviewid',isLoggedIn,async (req,res)=>{
    const {productid,reviewid}=req.params;
    try{
        const {rating,comment}=req.body;
        const userid=req.user._id;
        const review=await Review.findById(reviewid);
        const isEqual =review.author.userid.equals(userid);

        if(!comment.trim()){
            req.flash('error','cannot submit blank review');
        }else if(rating<=0){
            req.flash('error','give at least 1 star rating to submit review');
        }else if(isEqual){
            // const product=await Product.findById(productid);     //find the product

            await Review.findByIdAndUpdate(reviewid,{$set:{
                rating:rating,
                comment:comment
            }});       



            req.flash('success','review submitted successfully');
        }else{
            throw new Error('Problem in Editing the review');
        }   
    }catch(e){
        req.flash('error',e.message);
    }

    res.redirect(`/products/${productid}`);
})

router.delete('/products/:productid/review/:reviewid',isLoggedIn,async(req,res)=>{
    const {productid,reviewid}=req.params;
    const userid=req.user._id;
    const review=await Review.findById(reviewid);
    const product=await Product.findById(productid);
    
    try{
        const isEqual =review.author.userid.equals(userid);
        if(isEqual){
            product.reviews.pull({_id:review._id});
            await Review.findByIdAndDelete(reviewid);
        }

        product.save();
        req.flash('success','comment got deleted successfully')
    }catch(e){
        req.flash('error',e.message);
    }

    res.redirect(`/products/${productid}`);
    
})

module.exports=router;