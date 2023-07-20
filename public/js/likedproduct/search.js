const searchInput=document.getElementById('search-input');
const searchInput2=document.getElementById('search-input2');
const searchButton=document.getElementById('search-button');
const productSpace=document.getElementById('product-space');

let back2=document.getElementById('back2');
let forward2=document.getElementById('forward2');
let pagination2=document.getElementById('pagination2');
let page2=pagination.getAttribute('pageno2');
let pages2=pagination.getAttribute('pages2');

async function getproducts(searchValue,page){
    console.log(searchValue);
    const res=await fetch(`https://shopping-cart-tbh7.onrender.com/profile/${userid2}/${username2}/likedproducts/filters?q=${searchValue}`);
    const data=await res.json();
    const {products,currentUser}=data;
    // console.log('hi');
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
            Liked-Products
            <div style="width: 59%; text-align: end;" id="pagination2" pageno2="${page}" pages2="${pages}">
                <button class="btn btn-lg btn-secondary" id="back2"><</button>
                <button class="btn btn-lg btn-secondary" id="forward2">></button>
            </div>
        </h4>`;
    
    let lastproducts=products.splice(skip,limit);
    // console.log(products);
    for(let product of lastproducts){
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
        
        
                
        str+=`<div class="col-lg-3 col-md-6 col-6 mb-3" id="${ product._id }">
                <div class="card shadow-sm mx-auto position-relative indexCard">
                    <img src="${product.img}" class="card-img-top" alt="item image">
                    <span class="badge rounded-pill bg-light text-dark w-35 position-absolute translate-middle-y" id="rating-pill">
                        ${ rating } &star; | 5
                    </span>
                    <div class="card-body">
                      <h5 class="card-title d-flex justify-content-between align-items-center">
                        <span>${ product.name }</span>
                        ${temp}
                      </h5>
                      <p class="card-text fw-light" id="index-cardtext">${ product.desc}</p>
                      <p class="text-muted">${ product.reviews.length } reviews</p>
                      <h6 class="card-title"><span class="fw-lighter fs-6 text-decoration-line-through">Rs.${ product.price }</span> Rs.${ product.price } <span class="fw-light fs-6 text-warning">( 50 % OFF )</span> </h6>
                      <a href="/products/${product._id}" class="show-btn btn btn-sm btn-primary">Buy Now</a>
                    </div>
                </div>
              </div>`;
    }
    productSpace.innerHTML=str;
    spinner2.classList.toggle('display');
    page2=page;
    pages2=pages;
    back2=document.getElementById('back2');
    forward2=document.getElementById('forward2');
    pagination2=document.getElementById('pagination2');
    if(page2<=1){
        back2.setAttribute('disabled',true);
    }
    if(page2>=pages2){
        forward2.setAttribute('disabled',true);
    }
    function divertproducts2(page){
        pagination2.setAttribute('pageno',page);
        const searchValue=searchInput.value;
        searchInput2.value=searchInput.value;
        spinner2.classList.toggle('display');
        getproducts(searchValue,page);
        // window.location.href=`http://localhost:4000/products?page=${page}`;
    }
    
    back2.addEventListener('click',()=>{
        page2--;
        // console.log(page2);
        divertproducts2(page2);
        
    })
    forward2.addEventListener('click',()=>{
        page2++;
        // console.log(page2);
        divertproducts2(page2);
    })
    // console.log(data);
}


searchButton.addEventListener('click',async(e)=>{
    // console.log(searchInput.value);
    const searchValue=searchInput.value;
    searchInput2.value=searchInput.value;
    getproducts(searchValue,1);
    spinner2.classList.toggle('display');
    
    // .then((res)=>{console.log(res)});
})
searchInput.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        const searchValue=searchInput.value;
        searchInput2.value=searchInput.value;
        getproducts(searchValue,1);
        spinner2.classList.toggle('display');
    }
})

//pagination in search

//pagination

// const id=productpage.getAttribute('product_id')
