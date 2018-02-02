var areaMixOne = document.getElementById('areaMixOne'),
    areaMixTwo = document.getElementById('areaMixTwo'),
    areaMixFinal = document.getElementById('areaMixFinal'),
    comboMixOne = document.getElementById('comboMixOne'),
    comboMixTwo = document.getElementById('comboMixTwo'),
    mixPlaylistsButton = document.getElementById('mixPlaylistsButton'),
    playlistItemsMix = document.getElementById('playlistItemsMix'),
    arrayMixOne = [],
    arrayMixTwo = [],
    listaTemasArray = [];


function printUserPlaylists(userSearch){ 
            
        if ( userSearch === undefined) {
            userSearch = "myUser";    
        }
        
        var url = '/apiPlaylists/dataPlaylists?user=' + userSearch;
        peticionAJAX(url, function(data){

            data = JSON.parse(data);
            var dataItems = data.items;

            if ( dataItems.length === 0){
                
                var modalTinyNoFooter = new tingle.modal({
                   onOpen: function() {
                      searchInput.blur()
                    },
                   beforeClose: function(){
                       this.destroy()
                   }
                });
                modalTinyNoFooter.open();
                modalTinyNoFooter.setContent("No matches found");

                
            } else {
                
                itemsList = "<option data-selector='index-option'>Select your playlist</option>";
                dataItems.forEach(function ShowResults(value, index){
                itemsList += "<option id="+ value.id + " data-user="+ value.ownerId +">" + value.name + "</option>";

                });
                document.getElementById('comboMixOne').innerHTML = itemsList;
                document.getElementById('comboMixTwo').innerHTML = itemsList;
                itemsList = '';
            }
        });
    
};

printUserPlaylists();    


/**
 * Consulta la api de spotify y devuelve un objeto con dicha busqueda
 * Si la busqueda la devuleve vacia muestra un error
 * Si ya hay items añade n más
 * @function
 */


function PrintPlaylist(mixZone, id, ownerId){ 
    
    var url = '/apiListsTracks/:datatracks?id=' + id + "&user=" + ownerId;
    var arrayTest;
    listaTemasArray = []; 
    
    peticionAJAX(url, function(data){

            data = JSON.parse(data);
            var dataItems = data.items;
            
            var listItemsMix = '';
            dataItems.forEach(function ShowResults(value, index) {
                listItemsMix += '<li class="mix-list__item">' +
                                '<div class="mix-list__title"><p><span class="txt-bold">' + value.artist + '</span> / ' + value.name +'</p></div>' +
                                '<div class="mix-list__buttons">'+
                                   '<button class="play-preview" title="play" data-id="' + value.id + '" data-preview="' + value.previewURL + '"><i class="fa fa-play" aria-hidden="true"></i></button></div>' +
                                '</li>';
                listaTemasArray.push(value)
            });
            mixZone.innerHTML = listItemsMix;
            listItemsMix = '';
            
            
            if (mixZone === areaMixOne) {
                arrayMixOne = listaTemasArray;
            } else if (mixZone === areaMixTwo) {
                arrayMixTwo = listaTemasArray;
            }
            
            watchEmptyMixlists()
            return listaTemasArray;
            
    });        
};


// recarga el area del playlist
function reloadMixArea(miCombo, mixArea){
    
    
    if (miCombo.options[miCombo.selectedIndex].getAttribute('id') != null){
        PrintPlaylist(
            mixArea,
            miCombo.options[miCombo.selectedIndex].getAttribute('id'),
            miCombo.options[miCombo.selectedIndex].getAttribute('data-user')
        );
        
    } else {
        
        
        if (miCombo === comboMixOne) {
            
            arrayMixOne = [];
            areaMixOne.innerHTML = '';
            listaTemasArray = [];
            watchEmptyMixlists();
            
        } else if (miCombo === comboMixTwo) {
            
            arrayMixTwo = [];
            areaMixTwo.innerHTML = '';
            listaTemasArray = [];
            watchEmptyMixlists();
            
        }
        
    };
};



function watchEmptyMixlists(){
    if ( arrayMixOne.length != 0 && arrayMixTwo.length != 0){
        mixPlaylistsButton.classList.remove('disabled');
    } else {
        mixPlaylistsButton.classList.add('disabled');
    }
};


comboMixOne.addEventListener('change', function(){
    reloadMixArea(this, areaMixOne);
    arrayMixOne = listaTemasArray;
});


comboMixTwo.addEventListener('change', function(){
    reloadMixArea(this, areaMixTwo);
    arrayMixTwo = listaTemasArray;
});



function arrayRandom(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

// junta las dos playlists
var playListFinal;
mixPlaylistsButton.addEventListener('click', function(){
    
    smallModal.open();
    smallModal.setContent("The Playlist is mixed");
    
        
    tracksToPlaylist = [];
    itemsToPlaylist = arrayRandom(arrayMixOne.concat(arrayMixTwo));
    
    itemsToPlaylist.forEach(function dataPlaylist(value, index){
        tracksToPlaylist.push(value.uri);
    });
    
    addPlaylist(itemsToPlaylist, false);
    window.localStorage.setItem('playListStorage', JSON.stringify(playListFinal));
    listName.removeAttribute("disabled");
            
    
});


    