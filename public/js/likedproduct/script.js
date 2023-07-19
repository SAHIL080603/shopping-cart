//pagination
const back=document.getElementById('back');
const forward=document.getElementById('forward');
const pagination=document.getElementById('pagination');
let page=pagination.getAttribute('pageno');
let pages=pagination.getAttribute('pages');
let userid=pagination.getAttribute('userid');
let username=pagination.getAttribute('username');
// const id=productpage.getAttribute('product_id')
if(page<=1){
    back.setAttribute('disabled',true);
}
if(page>=pages){
    forward.setAttribute('disabled',true);
}
function divertproducts(page){
    pagination.setAttribute('pageno',page);

    window.location.href=`https://shopping-cart-tbh7.onrender.com/profile/${userid}/${username}/likedproducts?page=${page}`;
}

back.addEventListener('click',()=>{
    page--;
    // console.log(page);
    divertproducts(page);
    
})
forward.addEventListener('click',()=>{
    page++;
    divertproducts(page);
})

// window.onbeforeunload = function(e)
// {
//     spinner2.classList.toggle('display');
// }

