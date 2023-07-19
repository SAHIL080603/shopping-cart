const productForm=document.querySelector('.productForm');
// const spinner=document.querySelector('.spinner');
const spinnermessage=document.querySelector('.spinner-message');
const body2=document.querySelector('body');

// console.log(productForm);
productForm.addEventListener('submit',(e)=>{
    // console.log('hi');
    // e.preventDefault();
    productForm.style.filter='blur(2px)';
    productForm.style.pointerEvents='none';
    
    // body.style.filter='grayscale(1)';
    body2.style.pointerEvents='none';
    spinner2.classList.toggle('display');
    spinnermessage.classList.toggle('display');
})

