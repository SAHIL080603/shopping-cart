if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express=require('express');
const app=express();
const path=require('path');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const session=require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/User');
const cloudinary = require('cloudinary');
const MongoStore = require('connect-mongo');



//Routes
const productRoutes=require('./routes/productRoutes');
const reviewRoutes=require('./routes/reviewRoutes');
const authRoutes=require('./routes/authRoutes');
const cartRoutes=require('./routes/cartRoutes');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/shopping-app';

mongoose.connect(dbUrl)
    .then(console.log('Database Conneted!!'))
    .catch((err)=>{console.log(err)})



app.set('view engine','ejs'); //we need to install ejs-mate to add some more features to ejs
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const secret= process.env.SECRET || 'weneedsomebettersecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 60 * 60 * 24 * 1
  })

const sessionConfig={
    store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        // secure:true;
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
}

app.use(session(sessionConfig));
app.use(passport.authenticate('session'));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const cloud_name= process.env.CLOUD_NAME;
const api_key= process.env.API_KEY;
const api_secret=process.env.API_SECRET;

cloudinary.v2.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true,
  });

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.info=req.flash('info');
    res.locals.warning=req.flash('warning');
    res.locals.currentUser=req.user;
    next();
})

app.get('/',(req,res)=>{
    res.render('home');
})



app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);

app.get('*',(req,res)=>{
    res.render('lost')
})



const port = process.env.PORT || 4000;


app.listen(port,()=>{
    console.log(`Server started listening at port ${port}`);
})