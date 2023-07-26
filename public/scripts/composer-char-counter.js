$(document).ready(function() {
  const tweetMaxLength = 140; // Change this to your desired character limit

  $("#tweet-text").on("input", function() {
    const remainingChars = tweetMaxLength - $(this).val().length;
    const $counter = $('.counter');
    $counter.text(remainingChars);

    // Add or remove the 'limit-exceeded' class based on the character count
    if (remainingChars < 0) {
      $counter.addClass('limit-exceeded');
    } else {
      $counter.removeClass('limit-exceeded');
    }
  });
});
