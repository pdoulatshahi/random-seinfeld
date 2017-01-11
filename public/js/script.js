$(document).ready(() => {
  $('#clear-seasons').click((e) => {
    e.preventDefault();
    $('.one-season-checkbox').prop('checked', false);
  })
})
