/*  ---------------------------------------------------
  Template Name: DJoz
  Description:  DJoz Music HTML Template
  Author: Colorlib
  Author URI: https://colorlib.com
  Version: 1.0
  Created: Colorlib
---------------------------------------------------------  */



(function($) {
 

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function() {
    
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function() {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
		Navigation
	--------------------*/
  
    /*------------------
		Barfiller
	

    /*-------------------
		Nice Scroll
	--------------------- */
    // $(".nice-scroll").niceScroll({
    //     cursorcolor: "#111111",
    //     cursorwidth: "5px",
    //     background: "#e1e1e1",
    //     cursorborder: "",
    //     autohidemode: false,
    //     horizrailenabled: false
    // });




    $("#search-icon").click(function() {
          
        $(".nav").toggleClass("search");
        $(".nav").toggleClass("no-search");
        $(".search-input").toggleClass("search-active");
      });
      
      $('.menu-toggle').click(function(){
         $(".nav").toggleClass("mobile-nav");
         $(this).toggleClass("is-active");
      });


      
    // Function which adds the 'animated' class to any '.animatable' in view
    var doAnimations = function() {
      
        // Calc current offset and get all animatables
        var offset = $(window).scrollTop() + $(window).height(),
            $animatables = $('.animatable');
        
        // Unbind scroll handler if we have no animatables
        if ($animatables.length == 0) {
          $(window).off('scroll', doAnimations);
        }
        
        // Check all animatables and animate them if necessary
            $animatables.each(function(i) {
           var $animatable = $(this);
                if (($animatable.offset().top + $animatable.height() - 150) < offset) {
            $animatable.removeClass('animatable').addClass('animated');
                }
        });
    
        };
      
      // Hook doAnimations on scroll, and trigger a scroll
        $(window).on('scroll', doAnimations);
      $(window).trigger('scroll');



      $('.card-header').on("click", function() {
        $(this).find('span').toggleClass("fa-caret-up fa-caret-down");
        $('.card-header').removeClass("active");
        $(this).toggleClass("active");
      });


      const signUpButton = document.getElementById('signUp');
      const signInButton = document.getElementById('signIn');
      const container = document.getElementById('container');
      
      if(document.getElementById('signUp')!=null){
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });
    }
      if(document.getElementById('signIn')!=null){
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }
      window.addEventListener('click',()=>{
        if(document.getElementById('flash-msg')!=null)
       document.getElementById('flash-msg').style.display="none"
      })

      $('.wrap-rating').each(function(){
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function(){
            var index = item.index(this);
            var i = 0;
            for(i=0; i<=index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function(){
            var index = item.index(this);
            rated = index;
            $(input).val(index+1);
        });

        $(this).on('mouseleave', function(){
            var i = 0;
            for(i=0; i<=rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });
    

})(jQuery);
