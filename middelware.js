const Product = require("./models/Product");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to login first');
        return res.redirect('/login');
    }
    next();
}

module.exports.isRetailer=(req,res,next)=>{
    if(req.user.userType!='retailer'){
        req.flash('error','You are not authorised to do that');
        return res.redirect('/products');
    }
    next();
}

module.exports.isProductAuthor=async(req,res,next)=>{
    const {productid}=req.params;

    const product=await Product.findById(productid);

    if(product.author && product.author.equals(req.user._id)){
        return next();
    }
    req.flash('error','You are not authorised to do that');
    return res.redirect(`/products/${productid}`);
}

module.exports.isSameUser=async(req,res,next)=>{
    const {userid}=req.params;
    if(req.user._id.equals(userid)){
        return next();
    }
    req.flash('error','You are not authorised to do that');
    return res.redirect(`/products`);
}