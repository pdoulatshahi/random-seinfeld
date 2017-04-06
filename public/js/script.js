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
})
