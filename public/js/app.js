(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-90319924-1', 'auto');

$(document).ready(() => {
  ga('send', 'pageview');
})

$(document).ready(function(){
  $.getJSON("/episodes/all", (response) => {
    $('input.autocomplete').autocomplete({
      data: JSON.parse(response),
      limit: 10,
      onAutocomplete: function(val) {},
      minLength: 3,
    });
  });


  $.getJSON("/tags/all", (response) => {
      var tags = JSON.parse(response);
      $('.chips-autocomplete').material_chip({
        placeholder: 'Enter a tag',
        secondaryPlaceholder: 'Tags',
        autocompleteOptions: {
          data: tags,
          limit: 10,
          minLength: 2
        }
      });
  });

  $('.chips').on('chip.add', function(e, chip){
    var chipText = chip.tag;
    var currentTags = $("#tags").val();
    if (currentTags.length > 0) {
      var updatedTags = currentTags + ', ' + chipText;
    } else {
      var updatedTags = chipText;
    }
    $("#tags").val(updatedTags);
  });

  $('.chips').on('chip.delete', function(e, chip){
    var chipText = chip.tag;
    var currentTags = $("#tags").val();
    var currentTagArray = currentTags.split(', ');
    var deletedTagIndex = currentTagArray.indexOf(chipText);
    currentTagArray.splice(deletedTagIndex, 1);
    var updatedTags = currentTagArray.join(', ');
    $("#tags").val(updatedTags);
  });

});

/*! lazysizes - v3.0.0-rc2 */
!function(a,b){"use strict";function c(a,c){if(!f[a]){var d=b.createElement(c?"link":"script"),e=b.getElementsByTagName("script")[0];c?(d.rel="stylesheet",d.href=a):d.src=a,f[a]=!0,f[d.src||d.href]=!0,e.parentNode.insertBefore(d,e)}}var d,e,f={};b.addEventListener&&(e=/\(|\)|'/,d=function(a,c){var d=b.createElement("img");d.onload=function(){d.onload=null,d.onerror=null,d=null,c()},d.onerror=d.onload,d.src=a,d&&d.complete&&d.onload&&d.onload()},addEventListener("lazybeforeunveil",function(a){var b,f,g,h;a.defaultPrevented||("none"==a.target.preload&&(a.target.preload="auto"),b=a.target.getAttribute("data-link"),b&&c(b,!0),b=a.target.getAttribute("data-script"),b&&c(b),b=a.target.getAttribute("data-require"),b&&(lazySizes.cfg.requireJs?lazySizes.cfg.requireJs([b]):c(b)),g=a.target.getAttribute("data-bg"),g&&(a.detail.firesLoad=!0,f=function(){a.target.style.backgroundImage="url("+(e.test(g)?JSON.stringify(g):g)+")",a.detail.firesLoad=!1,lazySizes.fire(a.target,"_lazyloaded",{},!0,!0)},d(g,f)),h=a.target.getAttribute("data-poster"),h&&(a.detail.firesLoad=!0,f=function(){a.target.poster=h,a.detail.firesLoad=!1,lazySizes.fire(a.target,"_lazyloaded",{},!0,!0)},d(h,f)))},!1))}(window,document);

$(document).ready(() => {
  $('#clear-seasons').click((e) => {
    e.preventDefault();
    $('.one-season-checkbox').prop('checked', false);
  })
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $("#web-watch-link").hide();
    $("#mobile-watch-link").css('display', 'inline-block');
  } else {
    $("#web-watch-link").css('display', 'inline-block');
    $("#mobile-watch-link").hide();
  }
  $(".button-collapse").sideNav();
  $("#youtube_url").change(function() {
    var inputtedUrl = $(this).val();
    var youtubeId = getId(inputtedUrl);
    var embedHTML = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + youtubeId + '" frameborder="0" allowfullscreen></iframe>';
    $("#yt-container").html(embedHTML);
  });
  $(".dropdown-button").dropdown();
})

function getId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return false;
  }
}

$(document).ready(function(){
  var youtubeVideos = document.getElementsByClassName("youtube");
  for (var i = 0; i < youtubeVideos.length; i++) {
    var vid = youtubeVideos[i];
    console.log(vid.dataset.embed);
    var source = "https://img.youtube.com/vi/"+ vid.dataset.embed +"/hqdefault.jpg";
    var image = new Image();
    image.src = source;
    image.addEventListener("load", function() {
      vid.appendChild(image);
    }(i));
    vid.addEventListener("click", function() {
      var iframe = document.createElement( "iframe" );
      iframe.setAttribute( "frameborder", "0" );
      iframe.setAttribute( "allowfullscreen", "" );
      iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ this.dataset.embed +"?rel=0&showinfo=0&autoplay=1" );
      this.innerHTML = "";
      this.appendChild( iframe );
    });
  }
});
