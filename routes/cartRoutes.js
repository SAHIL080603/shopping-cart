const express=require('express');
const router=express.Router();
const User=require('../models/User');
const Product=require('../models/Product');
const {isLoggedIn}=require('../middelware');

router.get('/products/user/cart',isLoggedIn,(req,res)=>{
    try {
        const cart = req.user.cart;
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.count, 0);
        res.render('cart/cartPage', { cart,totalAmount });
    }
    catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/products');
    }
})

router.get('/products/:productid/cart',isLoggedIn,async(req,res)=>{
    try{
        const {add}=req.query;
        const {productid}=req.params;
        const userid=req.user._id;
        const user=await User.findById(userid);

        // checks if product is already present
        const isPresent = user.cart.some((item) => item.id.equals(productid));

        // if present then we will only update the count
        // otherwise we will add a new product altogther
        // console.log(add);

        if (isPresent && add==='1') {
            const updateCart = user.cart.map((item) => item.id.equals(productid) ? { ...item, count: item.count+1} : item);
            user.cart = updateCart;
        }else if(isPresent && add==='-1'){
            console.log(add);
            const updateCart = user.cart.map((item) => item.id.equals(productid) ? { ...item, count: item.count-1} : item);
            user.cart = updateCart;
        } 

        await user.save();

        res.redirect('/products/user/cart');

    }catch(e){
        req.flash('error',e.message);
        res.redirect('/products/user/cart');
    }
})

router.post('/products/:productid/cart',isLoggedIn,async(req,res)=>{
    try{
        const {productid}=req.params;
        const userid=req.user._id;
        const user=await User.findById(userid);

        // checks if product is already present
        const isPresent = user.cart.some((item) => item.id.equals(productid));

        // if present then we will only update the count
        // otherwise we will add a new product altogther

        if (isPresent) {
            const updateCart = user.cart.map((item) => item.id.equals(productid) ? { ...item, count: item.count + 1 } : item);
            user.cart = updateCart;
        }
        else {
            const product = await Product.findById(productid);

            user.cart.push({
                name: product.name,
                price: product.price,
                img: product.img,
                id: product._id
            });
        }

        await user.save();
        req.flash('success',`Product added to cart successfully`);
        // location.reload();
        res.redirect(`/products/${productid}`);

    }catch(e){
        req.flash('error','Cannot add the product to the cart at the moment');
        res.redirect('/products');
    }

    
})


router.delete('/products/:productid/cart',isLoggedIn,async(req,res)=>{
    try{
        const {productid}=req.params;
        const userid=req.user._id;
        const user=await User.findById(userid);

        // checks if product is already present
        const isPresent = user.cart.some((item) => item.id.equals(productid));

        // if present then we will only update the count
        // otherwise we will add a new product altogther

        if (isPresent) {
            user.cart.pull({id:productid});
        }
        else {
            throw new Error('Cannot remove the product right as it does not exist')
        }

        await user.save();

        res.redirect('/products/user/cart');

    }catch(e){
        req.flash('error',e.message);
        res.redirect('/products');
    }

    
})



module.exports=router;