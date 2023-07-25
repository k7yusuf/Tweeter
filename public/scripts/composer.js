const createTweetElement= require("./client.js")
$(document).ready(function() {
  // Function to escape text to prevent XSS
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
  

// Keep track of the state of the new-tweet section
let newTweetVisible = false;

// Function to toggle new-tweet section
const toggleNewTweet = function() {
  console.log("toggleNewTweet")
  const $newTweetSection = $('.new-tweet');

  // If the section is currently visible, hide it and update the state
  if (newTweetVisible) {
    $newTweetSection.slideUp(function() {
      newTweetVisible = false;
    });
  } else {
    // If the section is currently hidden, show it and update the state
    $newTweetSection.slideDown(function() {
      newTweetVisible = true;
      // Enable the textarea and focus on it when the section is shown
      $('#tweet-text').prop('disabled', false).focus();
    });
  }
};

// Attach click event to the "Write a new tweet" div
$('.write-tweet').click(toggleNewTweet);

  // Function to display the scroll-to-top button
  const $scrollButton = $('<div class="scroll-to-top-btn"><i class="fas fa-arrow-up"></i></div>');
  $scrollButton.hide();
  $('body').append($scrollButton);

  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $scrollButton.fadeIn();
      $('.write-tweet').fadeOut();
    } else {
      $scrollButton.fadeOut();
      $('.write-tweet').fadeIn();
    }
  });

  // Function to handle scroll-to-top button click
  $scrollButton.click(function() {
    $('html, body').animate({ scrollTop: 0 }, 800);
    $('#tweet-text').prop('disabled', false).focus();
  });

  //create tweet function ends
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  };

  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        renderTweets(data);
      },
      error: function(err) {
        console.log('Error fetching tweets:', err);
      }
    });
  };

  // Function to display error messages
  const showError = function(message) {
    const $errorMessage = $('.error-message');
    $errorMessage.text(message);
    $errorMessage.slideDown();
  };

  // Function to hide error messages
  const hideError = function() {
    $('.error-message').hide();
  };

  // Validate form before submitting
  $('#tweet-form').submit(function(event) {
    event.preventDefault();
    hideError();

    const tweetText = $('#tweet-text').val();

    // Check if tweet is empty or exceeds the character limit
    if (!tweetText || tweetText.trim() === '') {
      showError('Error: Tweet content cannot be empty.');
    } else if (tweetText.length > 140) {
      showError('Error: Tweet content exceeds the character limit of 140.');
    } else {
      // Submit the form if validation passes
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $(this).serialize(),
        success: function() {
          // Clear the textarea and reload tweets on successful submission
          $('#tweet-text').val('');
          loadTweets();
        },
        error: function(err) {
          console.log('Error posting tweet:', err);
        }
      });
    }
  });

  // Load tweets on page load
  loadTweets();
});
