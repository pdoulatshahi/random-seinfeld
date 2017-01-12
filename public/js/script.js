$(document).ready(() => {
  $('#clear-seasons').click((e) => {
    e.preventDefault();
    $('.one-season-checkbox').prop('checked', false);
  })
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $("#web-watch-link").hide();
    $("#mobile-watch-link").show();
  } else {
    $("#web-watch-link").show();
    $("#mobile-watch-link").hide();
  }
})
