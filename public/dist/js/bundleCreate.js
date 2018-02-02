function peticionAJAX(e,t){var a=new XMLHttpRequest;document.querySelector(".loader-content").style.display="flex",a.onreadystatechange=function(){if(4===a.readyState){if(a.status>=100&&a.status<=300){var s=JSON.parse(a.responseText);t(s)}else console.error("ERROR AJAX! en",e,JSON.parse(a.responseText));document.querySelector(".loader-content").style.display="none"}},a.open("GET",e,!0),a.send()}function addPlaylist(e,t){playlistList="",e.forEach(function(e,t){playlistList+='<li class="playlist__item"><div class="playlist__item__image"><img src="'+e.imageAlbum+'"></div><div class="playlist__item__title"><p class="name">'+e.name+'</p><p class="album">'+e.album+'</p></div><div class="playlist__item__buttons"><button class="play-preview" data-id="'+e.id+'" data-preview="'+e.previewURL+'"><i class="fa fa-play" aria-hidden="true"></i></button></div><div class="playlist__item__buttons"><button data-id="'+e.id+'" class="delete-button"><i class="fa fa-trash-o" aria-hidden="true"></i></button></div></div></li>'}),playlistItems.innerHTML=playlistList,0!=t&&(smallModal.open(),smallModal.setContent("The track is added"))}function deleteItemPlaylist(e){var t=[];itemsToPlaylist.forEach(function(e,a){t.push(e.id)}),audioObject&&audioObject.getAttribute("data-id")===e&&audioObject.pause();var a=t.indexOf(e);tracksToPlaylist.splice(a,1),itemsToPlaylist.splice(a,1),addPlaylist(itemsToPlaylist,!1),window.localStorage.setItem("playListStorage",JSON.stringify(itemsToPlaylist)),0===itemsToPlaylist.length&&(listName.setAttribute("disabled",!1),createPlaylistButton.setAttribute("disabled",!1),listName.value="")}function createPlaylist(e){playlistName=e.value;var t=new XMLHttpRequest;t.open("POST","/playlist"),t.setRequestHeader("Content-Type","application/json"),t.send(JSON.stringify({name:playlistName,tracksToAdd:tracksToPlaylist})),modalPlaylist.setContent("<p>The list has been created in your profile</p>"),modalPlaylist.open()}function resetPlaylist(){playListStorage=[],itemsToPlaylist=[],tracksToPlaylist=[],window.localStorage.setItem("playListStorage",JSON.stringify(itemsToPlaylist))}function toggleMenu(){pageWrap.classList.toggle("off"),mask.classList.toggle("show")}function cleanSearch(){itemsList="",itemsSearchResults.innerHTML=itemsList}function addItemsSearch(e){peticionAJAX("/apiSearch/data?keyword="+encodeURIComponent(e)+"&offset="+numOffset+"&searchType="+searchType,function(t){var a=(t=JSON.parse(t)).items;if(0===a.length){var s=new tingle.modal({onOpen:function(){searchInput.blur()},beforeClose:function(){this.destroy(),searchInput.value=""}});s.open(),s.setContent("No matches found")}else e!=searchWord&&(searchWord=e,cleanSearch()),a.forEach(function(e,t){itemsList+='<li class="c-item-box"><div class="c-item-box__img"><img src="'+e.imageAlbum+'"><div class="actions"><a title="play" class="track play-preview" data-preview="'+e.previewUrl+'" data-id="'+e.id+'"><i class="fa fa-play"  aria-hidden="true"></i></a><a title="add track" class="anade-playlist" data-uri="'+e.URITrack+'" data-id="'+e.id+' aria-hidden="true"><i class="fa fa-plus" ></i></a></div></div><div class="c-item-box__text"><p class="title">'+e.name+'</p><p class="subtitle">'+e.album+"</p></div></li>"}),itemsSearchResults.innerHTML=itemsList,10!=a.length&&addMoreWrap.classList.remove("hide"),a.length<8&&addMoreWrap.classList.add("hide")})}function searchSpoty(){if(""!=searchInput.value)cleanSearch(),addItemsSearch(searchInput.value.trim());else{var e=new tingle.modal({cssClass:["modal--error-search"],onOpen:function(){searchInput.blur()},beforeClose:function(){this.destroy()}});e.open(),e.setContent("The search is empty")}}var audioObject=null,mainApp=document.getElementById("mainApp"),pageWrap=document.getElementById("pageWrap"),mask=document.getElementById("mask");mainApp.addEventListener("click",function(e){var t=e.target;if(null!==t&&t.classList.contains("play-preview")){if("null"===t.getAttribute("data-preview"))return smallModal.open(),void smallModal.setContent("No funciona el audio ostia");if(t.classList.contains("playing"))audioObject.pause();else{audioObject&&audioObject.pause();var a=t.getAttribute("data-preview");(audioObject=new Audio(a)).play(),audioObject.setAttribute("data-id",t.getAttribute("data-id")),t.classList.add("playing"),t.querySelector(".fa").classList.add("fa-pause"),t.querySelector(".fa").classList.remove("fa-play"),t.setAttribute("title","pause track"),t.parentNode.classList.add("active"),audioObject.addEventListener("ended",function(){t.classList.remove("playing"),t.querySelector(".fa").classList.remove("fa-pause"),t.querySelector(".fa").classList.add("fa-play"),t.setAttribute("title","play track"),t.parentNode.classList.remove("active")}),audioObject.addEventListener("pause",function(){t.classList.remove("playing"),t.querySelector(".fa").classList.remove("fa-pause"),t.querySelector(".fa").classList.add("fa-play"),t.setAttribute("title","play track"),t.parentNode.classList.remove("active")})}}});var tracksToPlaylist=[],itemsToPlaylist=[],playlistName="new playlist",playlistList="",itemsList="",playlistItems=document.getElementById("playlistItems"),createPlaylistButton=document.getElementById("playlistAdd"),smallModal=new tingle.modal({closeMethods:["overlay","button","escape"],cssClass:["modal--add-track"],onOpen:function(){window.setTimeout(function(){smallModal.close()},1e3)}});playlistItems.addEventListener("click",function(e){var t=e.target;t.classList.contains("delete-button")&&deleteItemPlaylist(t.getAttribute("data-id"))}),listName.addEventListener("keyup",function(e){0!=this.value?(createPlaylistButton.removeAttribute("disabled"),13!=e.which&&13!=e.keyCode||createPlaylist(listName)):createPlaylistButton.setAttribute("disabled",!1)}),createPlaylistButton.addEventListener("click",function(e){createPlaylist(listName)});var modalPlaylist=new tingle.modal({closeMethods:[],footer:!0,stickyFooter:!0});modalPlaylist.addFooterBtn("NEW PLAYLIST","c-button tingle-btn",function(){resetPlaylist(),playlistItems.innerHTML="",pageWrap.classList.contains("search-page")?(itemsSearchResults.innerHTML="",addMoreButton.style.display="none"):pageWrap.classList.contains("mix-page")&&(arrayMixOne=[],areaMixOne.innerHTML="",listaTemasArray=[],comboMixOne.selectedIndex="0",arrayMixTwo=[],areaMixTwo.innerHTML="",listaTemasArray=[],comboMixTwo.selectedIndex="0",watchEmptyMixlists()),listName.value="",listName.setAttribute("disabled",!1),createPlaylistButton.setAttribute("disabled",!1),audioObject&&audioObject.pause(),modalPlaylist.close()}),modalPlaylist.addFooterBtn("CONTINUE","c-button tingle-btn",function(){modalPlaylist.close()});var playListStorage;window.localStorage&&0!=window.localStorage.length&&(playListStorage=JSON.parse(window.localStorage.getItem("playListStorage")),addPlaylist(itemsToPlaylist=playListStorage,!1),itemsToPlaylist.forEach(function(e,t){tracksToPlaylist.push(e.URItrack)}),0===itemsToPlaylist.length?listName.setAttribute("disabled",!1):listName.removeAttribute("disabled")),document.getElementById("toggleNav").addEventListener("click",function(e){toggleMenu()}),document.getElementById("closeNav").addEventListener("click",function(e){toggleMenu()}),mask.addEventListener("click",function(e){toggleMenu()}),document.getElementById("primaryNav").addEventListener("click",function(){resetPlaylist()});var searchWord,numOffset=0,searchButton=document.getElementById("searchButton"),searchInput=document.getElementById("searchField"),addMoreButton=document.getElementById("addMoreButton"),addMoreWrap=document.getElementById("addMoreWrap"),itemsSearchResults=document.getElementById("searchResults"),searchTypeCombo=document.getElementById("searchType"),searchType=searchTypeCombo.options[searchTypeCombo.selectedIndex].getAttribute("data-id");searchTypeCombo.addEventListener("change",function(){searchType=searchTypeCombo.options[searchTypeCombo.selectedIndex].getAttribute("data-id")}),searchInput.addEventListener("keypress",function(e){13!=e.which&&13!=e.keyCode||searchSpoty()}),searchButton.addEventListener("click",function(e){searchSpoty()}),addMoreButton.addEventListener("click",function(e){numOffset+=8,addItemsSearch(searchWord)}),mainApp.addEventListener("click",function(e){function t(){var e=a.parentNode.parentNode.parentNode;itemsToPlaylist.push({name:e.querySelector(".title").innerHTML,album:e.querySelector(".subtitle").innerHTML,imageAlbum:e.querySelector("img").getAttribute("src"),previewURL:e.querySelector(".play-preview").getAttribute("data-preview"),URItrack:a.getAttribute("data-uri"),id:a.getAttribute("data-id")}),addPlaylist(itemsToPlaylist),tracksToPlaylist.push(a.getAttribute("data-uri")),window.localStorage.setItem("playListStorage",JSON.stringify(itemsToPlaylist))}var a=e.target;if(a.classList.contains("anade-playlist")){var s=[];for(var i in itemsToPlaylist)s.push(itemsToPlaylist[i].URItrack);if(-1!=s.indexOf(a.getAttribute("data-uri"))){console.log("Ya estoy en la playlist");var l=new tingle.modal({closeMethods:[],footer:!0,stickyFooter:!0});l.addFooterBtn("Add Track","c-button tingle-btn",function(){t(),l.close()}),l.addFooterBtn("No","c-button tingle-btn",function(){l.close()}),l.open(),l.setContent("the song is already in the playlist, are you sure you want to add it?")}else t();listName.removeAttribute("disabled"),0!=listName.value&&createPlaylistButton.removeAttribute("disabled")}});