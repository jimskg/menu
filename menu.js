(function ($) {
  $(function () {

    var slidePosition = 1;
    const events = [
      { id:"event--1", name: '', title:"", date: "", photo: "", text: "" },
    ];

    createDots();

    function createDots(){
      const dotSpinners = document.getElementsByClassName('dot-spinner');
      for (element of dotSpinners) {
        const numberOfDots = 12;
        for (let i = 0; i < numberOfDots; i++) {
          const dot = document.createElement('div');
          dot.style.animationDelay = `-${i / numberOfDots}s`;
          dot.style.top = `${Math.sin((i / numberOfDots) * Math.PI * 2) * 40 + 50}%`;
          dot.style.left = `${Math.cos((i / numberOfDots) * Math.PI * 2) * 40 + 50}%`;
          element.appendChild(dot);
        }
      }
      
    }

    $(window).on('scroll', function () {
      fnOnScroll();
    });

    $(window).on('resize', function () {
      fnOnResize();
    });

    function fnOnScroll() {
      agPosY = $(window).scrollTop();

      fnUpdateFrame();
    }
  
    $('#back-id-button').on('click', function () {
      navigateTo('timeline-id', 'birthday-id-li');
    });

    $('#birthday-id-button').on('click', function () {
      navigateTo('birthday-id', 'back-id-li'); 
    });
    
    function togglePasswordVisibility() {
      const passwordInput = document.getElementById('password');
      const showPasswordBtn = document.getElementById('show-password-button-id');
      const enteredPassword = passwordInput.value;
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordBtn.textContent = '🙉';
      } else {
        passwordInput.type = 'password';
        showPasswordBtn.textContent = '🙈';
      }
    }
    
  });

  
  window.onclick = function(event) {
    var carouselModal = document.getElementById("carousel-modal-id");
    if (event.target == carouselModal) {
      carouselModal.remove();
      //carouselModal.style.display = "none";
    }
  } 
  
})(jQuery);
