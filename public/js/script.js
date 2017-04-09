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
    console.log("running");
    var inputtedUrl = $(this).val();
    var youtubeId = getId(inputtedUrl);
    var embedHTML = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + youtubeId + '" frameborder="0" allowfullscreen></iframe>';
    $("#yt-container").html(embedHTML);
  });
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
