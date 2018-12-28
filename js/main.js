/* File: main.js
 * -------------
 * Initialization and tab switching for CS41's home page.
 *
 * Revision history:
 * @sredmond 2017-02-13 Removed unused code
 * @skleung  2015-??-?? Created
 */

$(document).ready(function() {
  var $window = $(window);

  /* Splash Page */

  // Whether to force users through a splash page.
  // Set to true at the start of the quarter, during applications.
  // Set to false during the quarter.
  var SHOW_SPLASH_PAGE = false;

  // Keycodes to leave the splash page.
  var ENTER_KEYCODE = 13;
  var SPACE_KEYCODE = 32;
  var RIGHT_ARROW_KEYCODE = 39;
  var DOWN_ARROW_KEYCODE = 40;

  var $splashPage = $('.splash.page'); // Splash page w/ link to application
  var $contentPage = $('.content.page'); // Main course content 
  
  if (SHOW_SPLASH_PAGE) {
    $contentPage.hide();

    // Hide the splash page and show the content page.
    var showContent = function() {
      if ($splashPage.is(":visible")) {
        $contentPage.show(/* duration_ms = */ 100, function() {
          // Only when the content page finishes showing, fade out
          $splashPage.fadeOut();
        });
        
      }
    }
    
    // Show the content page when a user clicks the learn-more button.
    $('#learn-more').click(showContent);
    
    // Show the content page when a user hits any of the following keys.
    $window.keyup(function(event) {
      if (event.keyCode === ENTER_KEYCODE ||
          event.keyCode === SPACE_KEYCODE ||
          event.keyCode === RIGHT_ARROW_KEYCODE ||
          event.keyCode === DOWN_ARROW_KEYCODE) {
        showContent()
      }
    });
  } else {
    $splashPage.hide()
  }

  /* Tab Switching */
  var DEFAULT_TAB_HASH = '#overview';

  var getTabFromHref = function(href) {
    return $('#navigation a[href="' + href + '"]');
  };

  // Switch to active tab on reload
  var hash = window.location.hash || DEFAULT_TAB_HASH;
  getTabFromHref(hash).tab('show');

  // Show content tabs on click
  $('#navigation a[data-toggle="tab"]').click(function (event) {
    var $tab = $(this);
    var currentlyActive = $tab.parent().hasClass('active');
    var href = $tab.attr('href');
    if (!currentlyActive) {
      gtag('event', 'click', {
        'event_category': 'tab',
        'event_label': href,
        'transport_type': 'beacon',
      });
      // Update the page_path of the configuration details to point to a virtual page.
      gtag('config', 'UA-54146031-3', {'page_path': '/virtual/' + href});
    }
    // We changed the active tab and have a history object
    if (!currentlyActive && window.history && window.history.pushState) {
      window.history.pushState(null, null, $tab.attr('href'));
    }
    event.preventDefault();
  });

  // Send a click event to Google Analytics to track outbound links.
  // This will be applied to attributes of the form:
  // 
  //     <a href='foo' class='tracked external'>bar</a>
  // 
  // The event is sent with a category of 'outbound' and is labelled
  // by the link's href attribute. The transport type is 'beacon' so
  // that the browser attempts to use `navigator.sendBeacon` which
  // enables this tracking code to finish running even after the link
  // has been clicked.
  // TODO(sredmond): Consider adding an event_callback to better handle
  // non-`target='_blank'` links.
  $('a.tracked.external').click(function(event) {
    var $tab = $(this);
    var href = $tab.attr('href')
    gtag('event', 'click', {
      'event_category': 'outbound',
      'event_label': href,
      'transport_type': 'beacon'
    });
  });

  // Switch to the active tab when the browser jumps backwards in state.
  $window.on('popstate', function(event) {
    var hash = window.location.hash || DEFAULT_TAB_HASH;
    getTabFromHref(hash).tab('show');
  });
});