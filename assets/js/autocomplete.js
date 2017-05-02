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
