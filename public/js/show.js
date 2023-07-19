const productpage=document.getElementById('productpage');
const buttons=document.getElementById('buttons');
const prev=document.getElementById('previous');
const next=document.getElementById('next');
let page_r=buttons.getAttribute('pageno');
let pages_r=buttons.getAttribute('pages');
const id_r=productpage.getAttribute('product_id')
if(page_r<=1){
    prev.setAttribute('disabled',true);
}
if(page_r>=pages_r){
    next.setAttribute('disabled',true);
}
function divert(page){
    buttons.setAttribute('pageno',page);
    window.location.href=`https://shopping-cart-tbh7.onrender.com/products/${id_r}?page=${page}`;
}

prev.addEventListener('click',()=>{
    page_r--;
    divert(page_r);
    
})
next.addEventListener('click',()=>{
    page_r++;
    divert(page_r);
})

const editbuttons=document.querySelectorAll('.edit');
// console.log(editbuttons);
const form=document.querySelector('.form');
const editrating=document.querySelector('.edit-rating');
const editcomment=document.querySelector('.edit-comment');
// const editbutton=document.querySelector('#edit-button')
const body=document.querySelector('body');
for(let edit of editbuttons){
    // console.log(edit);
    edit.addEventListener('click',(e)=>{
        if(form.classList.contains('form-display')){
            form.classList.toggle('form-display');
            // body.classList.toggle('body');
            body.style.filter='grayscale(0.5)';
            // productpage.classList.toggle('productpage');
            productpage.style.pointerEvents='none';
        }
        const rating=edit.getAttribute('rating');
        const comment=edit.getAttribute('comment')
        const action=edit.getAttribute('action');
        form.setAttribute('action',`${action}?_method=PATCH`);
        // console.log(action);
        editrating.value=rating;
        editcomment.innerText=comment;
        // document.body.scrollTop="0px";
        // productpage.setAttribute('style','pointer-events: none;');
        // form.classList.toggle('form-display');
        // console.log(comment);
        
        
    })
}

const close=document.querySelector('.close');

close.addEventListener('click',(e)=>{
    form.classList.add('form-display');
    // body.classList.remove('body');
    body.style.filter='grayscale(0)';
    // productpage.classList.toggle('productpage');
    productpage.style.pointerEvents='';
})

window.onbeforeunload = function(e)
{
    spinner2.classList.toggle('display');
}

// const newProductform=document.getElementById('form');
// const progressBar=document.querySelector('.progress')

// newProductform.bind('fileuploadprogress', function(e, data) { 
    
//     progressBar.setAttribute('aria-valuenow', Math.round((data.loaded * 100.0) / data.total) + '%'); 
// });