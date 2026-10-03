const galleryPhotos=[...document.querySelectorAll('.gallery-photo')];
const lightbox=document.querySelector('.lightbox');
const lightboxImage=document.getElementById('lightbox-image');
const lightboxCount=document.getElementById('lightbox-count');
let currentPhoto=0,returnFocus=null;
function showPhoto(i){currentPhoto=(i+galleryPhotos.length)%galleryPhotos.length;const button=galleryPhotos[currentPhoto];const n=button.dataset.photo;lightboxImage.src='assets/'+n+'.webp';lightboxImage.alt='NYRP in-game gallery photograph '+n;lightboxCount.textContent=String(currentPhoto+1).padStart(2,'0')+' / '+galleryPhotos.length+' — NYRP PHOTO '+n}
galleryPhotos.forEach((button,i)=>button.addEventListener('click',()=>{returnFocus=button;showPhoto(i);lightbox.showModal();document.body.style.overflow='hidden';document.getElementById('lightbox-close').focus()}));
function closeLightbox(){lightbox.close()}
document.getElementById('lightbox-close').addEventListener('click',closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click',()=>showPhoto(currentPhoto-1));
document.getElementById('lightbox-next').addEventListener('click',()=>showPhoto(currentPhoto+1));
lightbox.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus()});
lightbox.addEventListener('click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeLightbox()}});
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(currentPhoto-1)}else if(e.key==='ArrowRight'){e.preventDefault();showPhoto(currentPhoto+1)}});
