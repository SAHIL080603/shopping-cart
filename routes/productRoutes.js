const express=require('express');
const router=express.Router();
const Product=require('../models/Product');
const User=require('../models/User');
const cloudinary = require('cloudinary');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const {isLoggedIn, isRetailer, isProductAuthor}=require('../middelware');


router.get('/products',async (req,res)=>{
    let {page}=req.query;
    try{
        const temproducts=await Product.find({});
        page=Number(page)||1;
        limit=20;
        let pages=Math.ceil(temproducts.length/limit);
        
        if(page<1){
            page=1;
        }else if(page>pages){
            page=pages;
        }
        let skip=(page-1)*limit;
        // console.log(temproducts);
        const tempproducts=await Product.find().populate('reviews','rating');
        const products=tempproducts.reverse().splice(skip,limit);
        res.render('products/index',{products,page,pages});
    }catch(e){
        req.flash('error','cannot get products right now..try later');
        res.redirect('/');
    }
    
    // console.log();
    // console.log(page);
    // console.log(temproducts);
    // console.log(products);
    
})

router.get('/search',async(req,res)=>{
    const {q}=req.query;
    try{
        const products=await Product.find({name:{$regex:`${q}`,$options:'i'}}).populate('reviews','rating');
        const finalProducts=[];
        for(let product of products){
            const nameArray= product.name.split(' ');
            let bool=false;
            for(let tempname of nameArray){
                // console.log(tempname);
                if(tempname.toUpperCase().startsWith(q.toUpperCase())){
                    // console.log(tempname);
                    bool=true;
                    break;
                }
                // console.log(tempname);
            }
            // console.log(bool);
            if(bool===true){
                finalProducts.push(product);
            }
        }
        // console.log(req.user);
        const currentUser=req.user;
        const result={
            finalProducts:finalProducts,
            currentUser:currentUser,
        }
        // console.log(result);
        res.status(200).json(result);   
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/products');
    }
    
})

//create product
router.get('/products/new',isLoggedIn,isRetailer,(req,res)=>{
    res.render('products/new')
})

router.post('/products',isLoggedIn,isRetailer,upload.single('image'),async (req,res)=>{
    try{
        const {name,price,desc}=req.body;
        let img;
        if(req.file){
            await cloudinary.v2.uploader.upload(
                req.file.path,
                { public_id: req.file.originalname },
                (error, result)=>{
                    if(error){
                        throw new Error(error);
                    }
                    img=result.url;
                }
            ); 
        }else{
            img='https://banner2.cleanpng.com/20210327/ozs/transparent-e-commerce-icon-sell-icon-shopping-bag-icon-605fac4eb70d14.2577853816168827667498.jpg';
        }
        // const {image}=req.file;
        // console.log(req.file);
        
        // await Product.create({name,price,desc,img});
        
        await Product.create({name,price,desc,img,author:req.user._id});
        // throw new Error('some error occured');
        req.flash('success','Product created successfully!!')
        res.redirect('/products');   
    }catch(e){
        // console.log(e);
        req.flash('error',`Cannot create the product at the moment ${e}`);
        res.redirect('/products/new'); 
    } 
})



router.get('/products/:productid',async (req,res)=>{

    try{
        const {productid}=req.params;
        let {page}=req.query;
        const {reviews}=await Product.findById(productid,'reviews');
        page=Number(page)||1;
        limit=5;
        let pages=Math.ceil(reviews.length/limit);
        
        if(page<1){
            page=1;
        }else if(page>pages){
            page=pages;
        }
        let skip=(page-1)*limit;
        const product=await Product.findById(productid,{reviews:{$slice:[skip, limit]}}).populate('reviews');

        // console.log(reviews.length);

        res.render('products/show',{product,page,pages});
    }catch(e){
        req.flash('error', 'Cannot find the product');
        res.redirect('/products');
    }
    
    
    
})

router.get('/products/:productid/edit',isLoggedIn,isRetailer,isProductAuthor,async(req,res)=>{
    try{
        const {productid}=req.params;
        const product=await Product.findById(productid);
        res.render('products/edit',{product});
    }catch(e){
        req.flash('error', 'Cannot edit the product');
        res.redirect('/products');
    }
    
})



router.patch('/products/:productid',isLoggedIn,isRetailer,isProductAuthor,upload.single('image'),async(req,res)=>{
    const {productid}=req.params;
    try{
        let img;
        if(req.file){
           await cloudinary.v2.uploader.upload(
            req.file.path,
            { public_id: req.file.originalname }, 
            (error, result)=>{
                if(error){
                    throw new Error(error);
                }
                img=result.url;
            }); 
        }
        
        const {name,price,desc}=req.body;
        await Product.findByIdAndUpdate(productid,{name,price,img,desc});
        req.flash('success','Updated the product successfully!!');
        res.redirect(`/products/${productid}`);
    }catch(e){
        req.flash('error', e.message);
        res.redirect(`/products`);
    }
    
})

router.delete('/products/:productid',isLoggedIn,isRetailer,isProductAuthor,async(req,res)=>{
    const {productid}=req.params;
    try{
        await Product.findByIdAndDelete(productid);
        req.flash('success', 'product deleted successfully.');
    }catch(e){
        req.flash('error', e.message);
    }
    res.redirect(`/products`);
})


//liking a product

router.get('/products/:productid/like',isLoggedIn,async(req,res)=>{
    const {productid}=req.params;
    const {bool}=req.query;

    try{
        const userid=req.user._id;
        const user=await User.findById(userid);

        
        if(bool==1){
            user.likedProducts.push(productid);
            req.flash('info','Added to liked products successfully');
        }else if(bool==0){
            user.likedProducts.remove(productid);
            req.flash('warning','Removed from liked products');
        }
        await user.save();
    }catch(e){
        req.flash('error',e.message)
    }
    
    
    res.redirect(`/products/${productid}`);
})

//filters
router.get('/filters',async(req,res)=>{
    let {q,ratingfilter,minpricefilter,maxpricefilter,sortfilter}=req.query;

    try{
        const fetchproducts=await Product.find({name:{$regex:`${q}`,$options:'i'}}).populate('reviews','rating');
        const finalProducts=[];
        for(let product of fetchproducts){
            let rating=product.reviews.reduce((sum,review)=>sum+review.rating,0) * 10;
                if(rating!==0){
                    rating=Math.round((rating/product.reviews.length))/10;
                }
            // console.log(rating);
            if(rating>=ratingfilter){
                finalProducts.push(product);
            }
        }
        const finalProducts2=[]
        for(let product of finalProducts){
            // console.log(product);
            if(minpricefilter=='' && maxpricefilter==''){
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
        // console.log(products);
        // req.flash('success','filter applied');
        res.status(200).json(result);

    }catch(e){
        req.flash('error',e.message);
        res.redirect('/products');
    }

    
})


module.exports=router;