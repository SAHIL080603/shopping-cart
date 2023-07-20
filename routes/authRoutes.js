const express=require('express');
const router=express.Router();
const User=require('../models/User');
const passport=require('passport');
const { isLoggedIn,isSameUser } = require('../middelware');



router.get('/register',(req,res)=>{
    res.render('auth/signup');
})

router.get('/profile/:userid/:username/likedproducts',isLoggedIn,isSameUser,async(req,res)=>{
    const {userid,username}=req.params;
    let {page}=req.query;

    try{
        const tempuser=await User.findById(userid);
        if(tempuser.username!=username){
            throw new Error('User with such username DNE');
        }
        page=Number(page)||1;
        limit=12;
        let pages=Math.ceil(tempuser.likedProducts.length/limit);

        if(page<1){
            page=1;
        }else if(page>pages){
            page=pages;
        }
        let skip=(page-1)*limit;
        // console.log(skip);
        // console.log(limit);
        
        const user=await User.findById(userid,{likedProducts:{$slice:[skip, limit]}}).populate({
            path:'likedProducts',
            populate:{
                path:'reviews',
            }
        });
        const currentUser=req.user;
        // console.log(user.likedProducts);
        res.render('auth/likedproducts',{user,page,pages,currentUser});
    }catch(e){
        req.flash('error',e.message);
        res.redirect(`/products`);
    }
})

//filters
router.get('/profile/:userid/:username/likedproducts/filters',isLoggedIn,isSameUser,async(req,res)=>{
    let {q,ratingfilter,minpricefilter,maxpricefilter,sortfilter}=req.query;
    const {userid,username}=req.params;
    try{
        const tempuser=await User.findById(userid).populate({
            path:'likedProducts',
            populate:{
                path:'reviews',
            }
        });
        if(tempuser.username!=username){
            throw new Error('User with such username DNE');
        }
        // console.log(tempuser.likedProducts);
        const tempuser2=[];
        for(let product of tempuser.likedProducts){
            let tempq=q.toUpperCase();
            let tempname=product.name.toUpperCase();
            if(q==null||q===''||q==undefined){
                tempuser2.push(product);
                // console.log(`1 ${product}`);
                // continue;
            }
            else if(tempname.includes(tempq)){
                tempuser2.push(product);
                // console.log(`2 ${product}`);
                // continue;
            }
            
        }
    
        // console.log(tempuser2);
        
        const finalProducts=[];
        for(let product of tempuser2){
            let rating=parseFloat(product.reviews.reduce((sum,review)=>sum+review.rating,0) * 10);
                if(rating!==0){
                    rating=Math.round((rating/product.reviews.length))/10;
                }
            // console.log(rating);
            
            if(rating>=(ratingfilter||0)){
                finalProducts.push(product);
            }
        }
    
        // console.log(finalProducts);
    
        const finalProducts2=[]
        for(let product of finalProducts){
            // console.log(product);
            if(!minpricefilter || !maxpricefilter){
                finalProducts2.push(product);
            }else if(minpricefilter=='' && maxpricefilter==''){
                minpricefilter=0;
                x = 1.797693134862315E+308;
                maxpricefilter = x * 1.001;
                
                // break;
            }
            else if(minpricefilter=='' && maxpricefilter!=''){
                minpricefilter=0;
            }
            else if(minpricefilter!='' && maxpricefilter==''){
                x = 1.797693134862315E+308;
                maxpricefilter = x * 1.001;
            }
            if(product.price>=minpricefilter && product.price<=maxpricefilter){
                finalProducts2.push(product);
                // console.log('hi');
            }
        }
    
        // console.log(finalProducts2);
    
        let finalProducts3=null;
        if(sortfilter==='1'){
            finalProducts3=finalProducts2;
        }
        else if(sortfilter==='2'){
            finalProducts3=finalProducts2.reverse();
        }else if(sortfilter==='3'){
            finalProducts3=finalProducts2.sort((p1,p2)=>(p1.name.toUpperCase() > p2.name.toUpperCase()) ? 1 : (p1.name.toUpperCase() < p2.name.toUpperCase()) ? -1 : 0);
        }else if(sortfilter==='4'){
            finalProducts3=finalProducts2.sort((p1,p2)=>(p1.name.toUpperCase() < p2.name.toUpperCase()) ? 1 : (p1.name.toUpperCase() > p2.name.toUpperCase()) ? -1 : 0);
        }else{
            finalProducts3=finalProducts2;
        }
        const products=finalProducts3;
        const currentUser=req.user;
        const result={
            products:products,
            currentUser:currentUser,
        }
        // console.log(finalProducts3);
        // req.flash('success','filter applied');
        res.status(200).json(result);

    }catch(e){
        req.flash('error','cannot apply filters now..');
        res.redirect(`/profile/${userid}/${username}/likedproducts`);
    }
    
})


router.get('/profile/:userid/:username',isLoggedIn,isSameUser, async(req,res)=>{
    const {userid,username}=req.params;
    // let {page}=req.query;
    
    try{
        const tempuser=await User.findById(userid);
        if(tempuser.username!=username){
            throw new Error('User with such username DNE');
        }
        const user=await User.findById(userid,{likedProducts:{$slice:[0, 10]}}).populate('likedProducts');
        res.render('auth/user',{user});
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/products');
    }
})

router.post('/register',async(req,res)=>{
    try{
        const {username,email,password,userType,officeAddress,instagramid,twitterid,facebookid}=req.body;
        let{telephone,phone,mobile}=req.body;
        // mobile=`+${phone} ${mobile}`;
        const user=new User({username,email,userType,officeAddress,telephone,mobile:{countryid:phone,number:mobile},instagramid,twitterid,facebookid});
        await User.register(user,password);
        req.flash('success','Registered Successfully');
        res.redirect('/login');
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
})

//edit
router.get('/profile/:userid/:username/edit',isLoggedIn,isSameUser,async(req,res)=>{
    const {userid,username}=req.params;
    try{
        const user=await User.findById(userid);
        res.render('auth/edit',{user});
    }catch(e){
        req.flash('error','cannot edit at this moment');
        res.redirect(`/profile/${userid}/${username}`);
    }
    
})
router.patch('/profile/:userid/:username/edit',isLoggedIn,isSameUser,async(req,res)=>{
    const {userid,username}=req.params;
    const {email,userType,officeAddress,telephone,phone,mobile,instagramid,twitterid,facebookid}=req.body;
    try{
        await User.findByIdAndUpdate(userid,{$set:{email,userType,officeAddress,telephone,mobile:{countryid:phone,number:mobile},instagramid,twitterid,facebookid}});
        res.redirect(`/profile/${userid}/${username}`);
    }catch(e){req.flash('error',e.message)}
    
    // res.render('auth/edit',{user});
})

router.get(`/login`,(req,res)=>{
    res.render('auth/login')
})

router.post('/login',
    passport.authenticate('local', 
    { 
        failureRedirect: '/login', 
        failureMessage: true, 
        failureFlash:true,
    }),
    function(req, res) {
        req.flash('success',`Welcome back again ${req.user.username}`)
        
        res.redirect(`/products`);
});

router.get('/logout', (req, res) => {
    req.logout((err)=> {
        if (err) { return next(err); }
        req.flash('success', 'GoodBye!');
        res.redirect('/login');
      });
})


module.exports=router;