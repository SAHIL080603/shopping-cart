//pagination
const back=document.getElementById('back');
const forward=document.getElementById('forward');
const pagination=document.getElementById('pagination');
let page=pagination.getAttribute('pageno');
let pages=pagination.getAttribute('pages');
// const id=productpage.getAttribute('product_id')
if(page<=1){
    back.setAttribute('disabled',true);
}
if(page>=pages){
    forward.setAttribute('disabled',true);
}
function divertproducts(page){
    pagination.setAttribute('pageno',page);

    window.location.href=`http://localhost:4000/products?page=${page}`;
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

