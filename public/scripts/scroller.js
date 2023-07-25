$(document).ready(function () {

  // Function to display the scroll-to-top button
  const $scrollButton = $('<div class="scroll-to-top-btn"><i class="fas fa-arrow-up"></i></div>');
  $scrollButton.hide();
  $('body').append($scrollButton);

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $scrollButton.fadeIn();
      $('.write-tweet').fadeOut();
    } else {
      $scrollButton.fadeOut();
      $('.write-tweet').fadeIn();
    }
  });

  // Function to handle scroll-to-top button click
  $scrollButton.click(function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
    $('#tweet-text').prop('disabled', false).focus();
  });

});
