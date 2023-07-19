const productSpace2=document.getElementById('product-space');
const filterform=document.getElementById('form-filter');
const ratingfilter=document.getElementById('ratingfilter');
const minpricefilter=document.getElementById('min');
const maxpricefilter=document.getElementById('max');
const sortfilter=document.getElementById('sortfilter');
const searchInput3=document.getElementById('search-input2');

let back3=document.getElementById('back2');
let forward3=document.getElementById('forward2');
let pagination3=document.getElementById('pagination2');
let page3=pagination.getAttribute('pageno2');
let pages3=pagination.getAttribute('pages2');
// console.log(filterform);
async function filterproducts(search,rating,min,max,sort,page){
    // console.log('inside getproducts');
    const res=await fetch(`http://localhost:4000/filters?q=${search}&ratingfilter=${rating}&minpricefilter=${min}&maxpricefilter=${max}&sortfilter=${sort}`);
    const data=await res.json();
    const {products,currentUser}=data;

    page=Number(page)||1;
    limit=12;
    let pages=Math.ceil(products.length/limit);
    
    if(page<1){
        page=1;
    }else if(page>pages){
        page=pages;
    }
    let skip=(page-1)*limit;

    let str=`<h4 class="brand display-4 bg-light p-3 rounded mb-3 d-flex">
                <i class="fab fa-shopify" style="margin-right: 20px;"></i>
                Liked Products
                <div style="width: 59%; text-align: end;" id="pagination2" pageno2="${page}" pages2="${pages}">
                    <button class="btn btn-lg btn-secondary" id="back2"><</button>
                    <button class="btn btn-lg btn-secondary" id="forward2">></button>
                </div>
            </h4>`;

    let letproducts=products.splice(skip,limit);
    // console.log(products);
    for(let product of letproducts){
        let rating=product.reviews.reduce((sum,review)=>sum+review.rating,0) * 10;
        // console.log(rating);
        if(rating!==0){
            rating=Math.round((rating/product.reviews.length))/10;
        }
        let temp='';
        // console.log(data.currentUser);
        // const currentUser=`<%=currentUser%>`;
        // console.log(currentUser);
        if(currentUser && currentUser.likedProducts && currentUser.likedProducts.includes(product._id)){
            temp= `<a href="/products/${ product._id}/like?bool=0" class="btn like-button bg-light rounded-circle" style="color: red;" id="like-button">
                <i  product-id="${product._i}" class="fa fa-heart"></i>
            </a>`
        }
        
        
                
        str+=`<div class="col-lg-3 col-md-6 mb-3" id="${ product._id }">
                <div class="card shadow-sm mx-auto position-relative" style="width: 15rem;">
                    <img src="${product.img}" class="card-img-top" alt="item image">
                    <span class="badge rounded-pill bg-light text-dark w-35 position-absolute translate-middle-y" style="top:35%;left:5%">
                        ${ rating } &star; | 5
                    </span>
                    <div class="card-body">
                      <h5 class="card-title d-flex justify-content-between align-items-center">
                        <span>${ product.name }</span>
                        ${temp}
                      </h5>
                      <p class="card-text fw-light">${ product.desc}</p>
                      <p class="text-muted">${ product.reviews.length } reviews</p>
                      <h6 class="card-title"><span class="fw-lighter fs-6 text-decoration-line-through">Rs.${ product.price }</span> Rs.${ product.price } <span class="fw-light fs-6 text-warning">( 50 % OFF )</span> </h6>
                      <a href="/products/${product._id}" class="show-btn btn btn-sm btn-primary">Buy Now</a>
                    </div>
                </div>
              </div>`;
    }
    productSpace2.innerHTML=str;
    spinner2.classList.toggle('display');
    page3=page;
    pages3=pages;
    back3=document.getElementById('back2');
    forward3=document.getElementById('forward2');
    pagination3=document.getElementById('pagination2');
    if(page3<=1){
        back3.setAttribute('disabled',true);
    }
    if(page3>=pages3){
        forward3.setAttribute('disabled',true);
    }
    function divertproducts2(page){
        pagination3.setAttribute('pageno',page);
        spinner2.classList.toggle('display');
        filterproducts(searchInput3.value,ratingfilter.value,minpricefilter.value,maxpricefilter.value,sortfilter.value,page);
        // window.location.href=`http://localhost:4000/products?page=${page}`;
    }
    
    back3.addEventListener('click',()=>{
        page3--;
        // console.log(page2);
        divertproducts2(page3);
        
    })
    forward3.addEventListener('click',()=>{
        page3++;
        // console.log(page2);
        divertproducts2(page3);
    })
    // console.log(data);
}
const submitfilter=document.getElementById('submit-filter');
const pricerangetext=document.getElementById('price-range-text');
filterform.addEventListener('submit',(e)=>{
    e.preventDefault();
    // console.log(sortfilter.value);
    // console.log(searchInput3.value);
    // console.log(minpricefilter.value);
    // console.log(maxpricefilter.value);
    
    
        
    if(Number(minpricefilter.value)<=Number(maxpricefilter.value)){
        // console.log('hi1');
        spinner2.classList.toggle('display');
        pricerangetext.classList.add('display');
        filterproducts(searchInput3.value,ratingfilter.value,minpricefilter.value,maxpricefilter.value,sortfilter.value,1);
    
    }else if(maxpricefilter.value==''){
        spinner2.classList.toggle('display');
        pricerangetext.classList.add('display');
        filterproducts(searchInput3.value,ratingfilter.value,minpricefilter.value,maxpricefilter.value,sortfilter.value,1);
    
    }
    else{
        // console.log('hi2');
        pricerangetext.classList.remove('display');
    }
    
    
    
    // console.log(filterform.elements);
})

minpricefilter.addEventListener('keyup',(e)=>{
    if(Number(minpricefilter.value)<=Number(maxpricefilter.value)){
        pricerangetext.classList.add('display');
        submitfilter.setAttribute('data-bs-toggle',"offcanvas")
    }else if(maxpricefilter.value===''){
        pricerangetext.classList.add('display');
        submitfilter.setAttribute('data-bs-toggle',"offcanvas")
    }
    else{
        submitfilter.setAttribute('data-bs-toggle',"")
        pricerangetext.classList.remove('display');
    }
    
})
maxpricefilter.addEventListener('keyup',(e)=>{
    if(Number(minpricefilter.value)<=Number(maxpricefilter.value)){
        pricerangetext.classList.add('display');
        submitfilter.setAttribute('data-bs-toggle',"offcanvas")
    }else if(maxpricefilter.value===''){
        pricerangetext.classList.add('display');
        submitfilter.setAttribute('data-bs-toggle',"offcanvas")
    }
    else{
        submitfilter.setAttribute('data-bs-toggle',"")
        pricerangetext.classList.remove('display');
    }
})

