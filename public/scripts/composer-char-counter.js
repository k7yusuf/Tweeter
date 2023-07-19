$(document).ready(function() {
  const $tweetText = $('#tweet-text');

  $tweetText.on('input', function() {
    const remainingChars = 140 - $(this).val().length;
    const $counter = $('.counter');
    $counter.text(remainingChars);

    if (remainingChars < 0) {
      $counter.addClass('invalid');
    } else {
      $counter.removeClass('invalid');
    }
  });
});

