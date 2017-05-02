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
