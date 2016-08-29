$(document).ready(function() {
   /*============= Chat sidebar ==============================*/
  $('.chat-sidebar, .nav-controller, .chat-sidebar a').on('click', function(event) {
      $('.chat-sidebar').toggleClass('focus');
  });

  $(".hide-chat").click(function(){
      $('.chat-sidebar').toggleClass('focus');
  });

    //comment this code if you want to show chat
    $('.chat-sidebar').toggleClass('focus');


  /*============= About page ==================================*/
  $(".about-tab-menu .list-group-item").click(function(e) {
      e.preventDefault();
      $(this).siblings('a.active').removeClass("active");
      $(this).addClass("active");
      var index = $(this).index();
      $("div.about-tab>div.about-tab-content").removeClass("active");
      $("div.about-tab>div.about-tab-content").eq(index).addClass("active");
  });

  /*==============  show login and register panel ===============*/
  $(".btn-panel-home").click(function(){
    $(".panel-home").toggleClass("hidden");
    $(".panel-home").toggleClass("animated");
    $(".panel-home").toggleClass("fadeInRight");
  });

  /*============== show image in modal when click =================*/
  $('img.show-in-modal').click(function(e){
    $('.photo-modal .img-content').attr('src', $(this).attr('src'));
    $('.photo-modal').modal('show');
    e.preventDefault();
  });

  $('a.show-in-modal').click(function(e){
    $('.photo-modal .img-content').attr('src', $(this).find('img:first').attr('src'));
    $('.photo-modal').modal('show');
    e.preventDefault();
  });

  //fade in cover photos
  setInterval(function(){
    cycleimages($('#cycler1'))
  }, 5000);

    //--------------------------------------------
    // for select place holder color change
    $('select').change(function() {
        if ($(this).children('option:first-child').is(':selected')) {
            $(this).addClass('customplaceholder');
        } else {
            $(this).removeClass('customplaceholder');
        }
    });// for select place holder color change end

    //default navigation select
    try {
        document.getElementById('contact-detail').focus();
    }catch(e){}

    $('.datetimepicker').datetimepicker({
        format:'M/D/YYYY'
    });
   window.setTimeout(function() { $('#cPassword').val('')  }, 200);
})

function cycleimages(container){
  var $active = container.find('.active');
  $next = ($active.next().length > 0) ? $active.next() : container.find('.comp-photo:first');
  $next.css('z-index',2);//move the next image up the pile
  $active.fadeOut(1500,function(){//fade out the top image
  $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
  $next.css('z-index',3).addClass('active');//make the next image the top one
  });
}

//mantein cover header height
$(window).on('resize', function(){
  $('.feed-header').css('height',$('.comp-photo3').height());
});

