$(document).ready(function () {
  const createTweetElement = function (tweet) {
    // Function to escape text to prevent XSS
    const escape = function (str) {
      let div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };
    const $tweet = $(`
    <article class="tweet">
      <header class="tweet-header">
        <div class="tweet-header-left"> 
        <img class="avatar" src="${tweet.user.avatars}" alt="User Avatar">
        <h4 class="tweet-author">${tweet.user.name}</h4>
        </div>
        <span class="tweet-handle">${tweet.user.handle}</span>
      </header>
      <div class="tweet-content">
        <p class="tweet-text">${escape(tweet.content.text)}</p>
      </div>
      <footer class="tweet-footer">
        <span class="tweet-timestamp">${timeago.format(tweet.created_at)}</span>
        <div class="tweet-icons">
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
  `);

    return $tweet;
  };

//create tweet function ends
  const renderTweets = function (tweets) {
    // Empty the container before rendering tweets
    $('#tweets-container').empty();

    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  };

  const loadTweets = function () {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        renderTweets(data);
      },
      error: function (err) {
        console.log('Error fetching tweets:', err);
      }
    });
  };


  // Function to toggle new-tweet section
  const toggleNewTweet = function () {
    const $newTweetSection = $('.new-tweet');

    // Slide up the new-tweet section before toggling
    $newTweetSection.slideToggle(function () {
      if ($newTweetSection.is(':visible')) {
        // Show textarea and focus on it
        $('#tweet-text').focus();
      } else {
        // Hide textarea and reset form
        $('#tweet-text').prop('disabled', true).val('');
        $('.counter').text('140');
        hideError();
      }
    });
  };

  // Attach click event to the "Write a new tweet" div
  $('.write-tweet').click(toggleNewTweet);


  // Function to display error messages
  const showError = function (message) {
    const $errorMessage = $('.error-message');
    $errorMessage.text(message);
    $errorMessage.slideDown();
  };

  // Function to hide error messages
  const hideError = function () {
    $('.error-message').hide();
  };

  // Validate form before submitting
  $('#tweet-form').submit(function (event) {
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
        success: function () {
          // Clear the textarea and reload tweets on successful submission
          $('#tweet-text').val('');

          // Reset the character counter to 140
        $('.counter').text('140');
        
        loadTweets();
        },
        error: function (err) {
          console.log('Error posting tweet:', err);
        }
      });
    }
  });

  // Load tweets on page load
  loadTweets();
});
