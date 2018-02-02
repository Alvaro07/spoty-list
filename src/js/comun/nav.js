function toggleMenu(){
    pageWrap.classList.toggle('off');
    mask.classList.toggle('show');
}

document.getElementById('toggleNav').addEventListener('click', function(event){
    toggleMenu();
})
document.getElementById('closeNav').addEventListener('click', function(event){
    toggleMenu();
})

mask.addEventListener('click', function(event){
    toggleMenu(); 
})


document.getElementById('primaryNav').addEventListener('click', function(){
    resetPlaylist();
})