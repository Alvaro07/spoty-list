/**
 * varia el tipo de busqueda
 * @function
 */

var searchType = searchTypeCombo.options[searchTypeCombo.selectedIndex].getAttribute("data-id");
searchTypeCombo.addEventListener("change", function(){
    searchType = searchTypeCombo.options[searchTypeCombo.selectedIndex].getAttribute("data-id");
});


/**
 * Limpia tanto la variable que contiene los items de resultado, 
 * así como el contendor para dicha busqueda.
 * @function
 */

function cleanSearch(){
    itemsList = '';
    itemsSearchResults.innerHTML = itemsList;
}

/**
 * Consulta la api de spotify y devuelve un objeto con dicha busqueda
 * Si la busqueda la devuleve vacia muestra un error
 * Si ya hay items añade n más
 * @function
 */
 
function addItemsSearch(dataSearch){  
        
        
        var url = '/apiSearch/data?keyword=' + encodeURIComponent(dataSearch) + '&offset=' + numOffset + '&searchType=' + searchType;
        peticionAJAX(url, function(data){
            data = JSON.parse(data);
            
            var dataItems = data.items;

            if ( dataItems.length === 0){
                
                var modalTinyNoFooter = new tingle.modal({
                  onOpen: function() {
                      searchInput.blur()
                    },
                  beforeClose: function(){
                      this.destroy();
                      searchInput.value = '';
                  }
                });
                
                modalTinyNoFooter.open();
                modalTinyNoFooter.setContent("No matches found");
                
            } else {
                
                
                if ( dataSearch != searchWord ){
                    searchWord = dataSearch;
                    cleanSearch();
                } 
        
                // itemsList = "";
                dataItems.forEach(function ShowResults(value, index) {
                    itemsList += '<li class="c-item-box">' + 
                                 '<div class="c-item-box__img">' +
                                    '<img src="' + value.imageAlbum + '">' +
                                    '<div class="actions">' +
                                        '<a title="play" class="track play-preview" data-preview="'+ value.previewUrl + '" data-id="' + value.id + '"><i class="fa fa-play"  aria-hidden="true"></i></a>' +
                                        '<a title="add track" class="anade-playlist" data-uri="' + value.URITrack + '" data-id="' + value.id + ' aria-hidden="true"><i class="fa fa-plus" ></i></a>' +
                                  '</div></div>' +
                                  '<div class="c-item-box__text">' +
                                    '<p class="title">' + value.name + '</p>' +
                                    '<p class="subtitle">' + value.album + '</p>' +
                                  '</div></li>';
                 });
                 
                 itemsSearchResults.innerHTML = itemsList;

                 // REFACORIZAR A UNA SOLO!!
                 if (dataItems.length != 10){
                     addMoreWrap.classList.remove("hide");
                 }
                 
                 // REFACORIZAR A UNA SOLO!!
                 if (dataItems.length < 8) {
                   addMoreWrap.classList.add("hide");
                 }
                 
            }
        });
    
}



/**
 * Añade eventos de la busqueda en spotify
 * @function
 */
 function searchSpoty(){ 
     
      if (searchInput.value != ""){
           
           cleanSearch();
           addItemsSearch(searchInput.value.trim()); 
              
      } else {
          
          var modalTinyNoFooter = new tingle.modal({
              cssClass: ['modal--error-search'],
              onOpen: function() {
                  searchInput.blur()
                },
              beforeClose: function(){
                  this.destroy()
              }
          });
          
          modalTinyNoFooter.open();
          modalTinyNoFooter.setContent("The search is empty");
          
        }
 }; 
 
 
/**
 * Eventos para la busqueda de contenido
 * @function
 */
 
searchInput.addEventListener("keypress", function(event){
    if (event.which == 13 || event.keyCode == 13 ) {
        searchSpoty();
    };    
});
    
searchButton.addEventListener("click", function(event){
    searchSpoty();
});
 
 
/**
 * Evento para la busqueda de más items
 * @function
 */
addMoreButton.addEventListener("click", function(event){
    
    numOffset += 8;
    addItemsSearch(searchWord);
    
})  



/**
 * Escucha el evento click para construir el audio
 * Crea un objeto audio y lo reproduce con un click
 * @function
 */
 mainApp.addEventListener("click", function(e){
        var target = e.target;
        
        
        // si el click es en la portada del disco
        if (target !== null && target.classList.contains('play-preview')) { 
            
            if ( target.classList.contains('playing') ){
                 audioObject.pause();
                 
            } else {
                
                
                
                if (audioObject) {
                    audioObject.pause();
                }
                
                var preview = target.getAttribute("data-preview");
                
                
                audioObject = new Audio(preview);
                audioObject.play();
                audioObject.setAttribute("data-id", target.getAttribute("data-id"));
                
                console.log()
                
                target.classList.add('playing');
                target.querySelector(".fa").classList.add('fa-pause');
                target.querySelector(".fa").classList.remove('fa-play');
                target.setAttribute('title', 'pause track');
                target.parentNode.classList.add('active');
                
                audioObject.addEventListener('ended', function () {
                    target.classList.remove('playing');
                    target.querySelector(".fa").classList.remove('fa-pause');
                    target.querySelector(".fa").classList.add('fa-play');
                    target.setAttribute('title', 'play track');
                    target.parentNode.classList.remove('active');
                });
                
                audioObject.addEventListener('pause', function () {
                    target.classList.remove('playing');
                    target.querySelector(".fa").classList.remove('fa-pause');
                    target.querySelector(".fa").classList.add('fa-play');
                    target.setAttribute('title', 'play track');
                    target.parentNode.classList.remove('active');
                });
            }
        };
        
        
        // añadimos playlist
        if ( target.classList.contains("anade-playlist")){
            
            var fatherPath = target.parentNode.parentNode.parentNode;
              
            itemsToPlaylist.push({
                name : fatherPath.querySelector(".title").innerHTML,
                album: fatherPath.querySelector(".subtitle").innerHTML,
                image: fatherPath.querySelector("img").getAttribute("src"),
                previewURL : fatherPath.querySelector(".play-preview").getAttribute("data-preview"),
                URItrack : target.getAttribute("data-uri"),
                id : target.getAttribute("data-id")
            });
            
            addPlaylist(itemsToPlaylist);
            
            tracksToPlaylist.push(target.getAttribute("data-uri"));
    
            window.localStorage.setItem('playListStorage', JSON.stringify(itemsToPlaylist));
            
            // Hablitimaos el input para el nombre del playlist, asi como el boton si el campo tiene caractéres
            listName.removeAttribute("disabled");
            
            if (listName.value != 0) {
                createPlaylistButton.removeAttribute("disabled");
            }
            
            
            
        };

        
 }); 
 

 

 
 
 