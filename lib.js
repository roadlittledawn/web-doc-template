jQuery(document).ready(function($) {
/* ---------------------------------------------------------
 * SCALD has a "bug" that enables inline edit mode for
 * anyone with edit rights in all view modes.
 */

  jQuery('.dnd-legend-wrapper').removeAttr('contentEditable');
  jQuery('.dnd-legend-wrapper .meta').removeAttr('contentEditable');
  jQuery('.field-widget-text-with-summary .dnd-legend-wrapper .meta').attr('contentEditable', true);

/* ---------------------------------------------------------
 * Mollom has a "bug" that causes it to think an optional
 * comments field is spam when blank.
 */

//  jQuery('#edit-submitted-was-this-page-helpful-feedback-comments').focus(function() {
  jQuery('#edit-submitted-feedback-comments').focus(function() {
    if ($(this).val() == 'Comments optional (but appreciated).') { $(this).val(''); }
  });
  jQuery('#edit-submitted-feedback-comments').blur(function() {
    if ($(this).val() == '') { $(this).val('Comments optional (but appreciated).'); }
  });
/* ---------------------------------------------------------
 * Apache security breaks clean URLs for search because you
 * can't view a file or folder whose name begins with a
 * period
 * This means searching for '.NET' will throw an error as
 * it returns a URL of /serch/node/.NET
 */
  // search block
  $('#search-block-form').submit(function( event ) {
    $('#edit-search-block-form--2').val($('#edit-search-block-form--2').val().replace(/(^|\D)\./, '$1 '));
    });
  // search page search box
  $('#search-form').submit(function( event ) {
    $('#edit-keys').val($('#edit-keys').val().replace(/(^|\D)\./, '$1 '));
    $('#edit-or').val($('#edit-or').val().replace(/(^|\D)\./, '$1 '));
    });

/* ---------------------------------------------------------
 * add icon and target to external links
 */
  if ($('ol.search-results').length == 0) {
    $('#main-wrapper #content').find('a[href^="https:"], a[href^="http:"], a[href^="ftp:"], a[href^="//"]').each(function() {
      $(this).append(' <i class="fa fa-external-link fileinfo"><span>[external link]</span></i> ');
      $(this).attr('target', '_blank');
      $(this).attr('title', 'Link opens in a new window.');
      });
    // add icon and target to external links
    if (location.hash!='') {
      var topTarget = location.hash;
      $('html, body').scrollTop($(topTarget).offset().top-50);
      }
    $(window).on('hashchange', function(e){
      if (location.hash!='') {
        var topTarget = location.hash;
        $('html, body').scrollTop($(topTarget).offset().top-50);
        }
      });
    }

//  if ($('div.region-page-top').length == 0) {
    var pathArray = window.location.pathname.split( '/' );
    switch (pathArray [2]) {
      case 'insights':
        $('header#header').addClass('set-insights');
        break;
      case 'browser':
        $('header#header').addClass('set-browser');
        break;
      case 'apm':
        $('header#header').addClass('set-apm');
        break;
      case 'alerts':
        $('header#header').addClass('set-alerts');
        break;
      case 'mobile-monitoring':
      case 'mobile-apps':
        $('header#header').addClass('set-mobile');
        break;
      case 'platform':
      case 'plugins':
        $('header#header').addClass('set-platform');
        break;
      case 'server':
      case 'servers':
        $('header#header').addClass('set-server');
        break;
      }
 //   }
/* ---------------------------------------------------------
 * Page content menu generator
 * -------------------------------------
 * This routine automates the table of contents for
 * jump links internal to pages.
 * -----------------
 * Menu is inserted after an H2 with id="qiklinks"
 * Menu includes all H2 elements in the document
 * The script assumes the contents are titled "Contents"
 * Use the class 'freq-link" to include H3 and DT elements
 */

  $('.content #qiklinks').after('<ul />');
  $('.content h2').each(function() {
    if (!($(this).is('[id]'))) {
      $(this).attr('id', $(this).text().replace(/ /g,'-'));
      }
   // Note that common exclusinos are hard coded.
   // If this list gets too long, we will have to refine the context
   if ((($(this).text() != 'Quick links')
       && ($(this).text() != 'Search form')
       && ($(this).text() != 'Contents')
       && ($(this).text() != 'Internal notes')
       && ($(this).text() != 'Add a note'))
       && $('#qiklinks')) {
      h2This = $(this);
      $('.content #qiklinks').next().append('<li id="jumpto-'+$(h2This).attr('id')+'"><a href="#'+$(h2This).attr('id')+'">'+$(h2This).text()+'</a></li>');
      // add quick links for dt elements
      if ($(h2This).parent().find('dt').hasClass('freq-link')) {
        liThis = '#jumpto-'+$(h2This).attr('id');
        $(liThis).after('<ul />');
        $(h2This).nextUntil('h2').find('dt').each(function() {
          if ($(this).hasClass('freq-link')) {
            $(liThis).next().append('<li><a href="#'+$(this).attr('id')+'">'+$(this).text()+'</a></li>');
            }
          });
        }
      // add quick links for H3 elements
      if ($(h2This).parent().find('h3').hasClass('freq-link')) {
        liThis = '#jumpto-'+$(h2This).attr('id');
        $(liThis).after('<ul />');
        $(h2This).nextUntil('h2').find('h3').each(function() {
          if ($(this).hasClass('freq-link')) {
            $(liThis).next().append('<li><a href="#'+$(this).attr('id')+'">'+$(this).text()+'</a></li>');
            }
          });
        }
      }
    });

/* ---------------------------------------------------------
 * Clamshell creator
 * -------------------------------------
 * This accordions any DL with a class of 'clamshell-list'
 * and the comments form at the bottom of the page
 * -----------------
 * All elements are collapsed and accordion links added
 * Open all link added to the top of each list
 * If the URL has a hash for a list item that item is opened
 * and the page shifted to the top of the list item
 * Toggles manage list item or list as a whole
 * Hot key to open: S or F
 * Hot key to close: H
 */

// LOAD: add comments links
  $('section#comment-form-wrapper').find('h3').each(function () {
    $(this).prepend('<span class="right-link"><i class="fa fa-toggle-right more-link"></i></span>');
    });

// LOAD: hide comments form
  $('section#comment-form-wrapper').children('form').hide();

// EVENT: open fold on direct select
  $("section#comment-form-wrapper h3").click(function(event) {
    var togType = ($(this).find('i span').text() == '[show details]') ? true : false;
    $(this).find('i span').text(togType ? '[hide details]' : '[show details]');
    $(this).find('i').toggleClass('fa-toggle-right fa-toggle-down');
    $(this).next().toggle();
    return false;
    });

// LOAD: add list item links
  $('.clamshell-list').find('dt').each(function () {
    $(this).prepend('<span class="right-link"><a class="more-link" href="#'+$(this).attr('id')+'" title="'+$(this).text()+'"><i class="fa fa-toggle-right"><span>[show details]</span></i></a></span>');
    });

// LOAD: add all list items link
  $('.clamshell-list').each(function () {
    $(this).prepend('<dt class="list-header"><span class="right-link"><a class="all-link" href="#all-links" title="show all"><b>Show All</b> &nbsp; <i class="fa fa-list"></i></a></span> </dt>');
    });

// LOAD: hide all list items
  $('.clamshell-list').children('dd').hide();
// LOAD: open list item on direct link to it in URL
  if (($('dl').hasClass('clamshell-list')) && (location.hash!='')) {
    var clamshellTarget = location.hash;
    $(clamshellTarget).find('.more-link').find('i').addClass('fa fa-toggle-down').removeClass('fa-toggle-right');
    $(clamshellTarget).find('.more-link').find('i span').text('[hide details]');
    $(clamshellTarget).closest('dt').next().toggle();
    $('html, body').scrollTop($(clamshellTarget).offset().top-25);
    }

// EVENT: open fold on direct select
  $("a.more-link").click(function(event) {
    var togType = ($(this).find('i span').text() == '[show details]') ? true : false;
    $(this).find('i span').text(togType ? '[hide details]' : '[show details]');
    $(this).find('i').toggleClass('fa-toggle-right fa-toggle-down');
    $(event.target).closest('dt').next().toggle();
    return false;
    });

// EVENT: open target fold for internal link
  $(window).on('hashchange', function(e){
    if (($('dl').hasClass('clamshell-list')) && (location.hash!='')) {
      var clamshellTarget = location.hash;
      $(clamshellTarget).find('a.more-link i span').text('[hide details]');
      $(clamshellTarget).find('a.more-link i').toggleClass('fa-toggle-right fa-toggle-down');
      $(clamshellTarget).next().show();
      }
    });

// EVENT: open all folds on direct select
  $("a.all-link").click(function(event) {
    var togType = ($(this).find('b').text() == 'Show All') ? true : false;
    $(event.target).closest('dl').find('dd').toggle(togType);
    $(this).find('b').text(togType ? 'Hide All' : 'Show All');
    $(event.target).closest('dl').find('dt a.more-link i span').text(togType ? '[hide details]' : '[show details]');
    $(event.target).closest('dl').find('dt a.more-link i').attr('class', togType ? 'fa fa-toggle-down' : 'fa fa-toggle-right');
    return false;
    });
  });

// clamshell hotkeys
jQuery(document).ready(function($) {
  jQuery(document).on('keydown', function (e) {
    if ($('.clamshell-list') && !($('.search-text').is(":focus"))) {
      if ((e.ctrlKey && e.keyCode == 70 ) || (e.keyCode == 70) || (e.keyCode == 83)  ) {
        $('.clamshell-list').find('dd').show();
        $('.more-link').find('i').attr('class', 'fa fa-toggle-down');
        $('.more-link').find('i span').text('[hide details]');
        $('.clamshell-list').find('.all-link b').text('Hide All');
       }
      if (e.keyCode == 72) {
        $('.clamshell-list').find('dd').hide();
        $('.more-link').find('i').attr('class', 'fa fa-toggle-right');
        $('.more-link').find('i span').text('[show details]');
        $('.clamshell-list').find('.all-link b').text('Show All');
        }
      }
    });

/* ---------------------------------------------------------
 * Lightbox script
 * -------------------------------------
 * automatically applies itself to any image with a class of .thumbnail
 */

  // preload limages
  $('.context-inline_image').each(function(k, v) {
    rev = $(this).find('img').attr('src').replace('inline_660px','full_size');
    $('<img/>')[0].src = rev;
    });

  $('.context-inline_image img').live('click', function(e) {
    //Get image
    var img_path = $(this).attr('src').replace('inline_660px','full_size');
    // if exists, populate
    if ($('#lightbox').length > 0) {
      $('#imgbox').html('<img src="' + img_path + '" />');
      if ($('#lightbox')) { $('#lightbox').find('img').addClass('lightbox-img'); }
      $('#lightbox').fadeToggle();
      }
    // if not exists, create and populate
    else {
      var lightbox =
      '<div id="lightbox" style="overflow: auto;">\n' +
        '<p>[ close ]</p>\n' +
        '<div id="imgbox"><img class="lightbox-img"src="' + img_path +'" /></div>\n' +
      '</div>';
      $('body').append(lightbox);
      $('#lightbox').fadeToggle();
      }
    });
  //Click anywhere to clear
  $('#lightbox').live('click', function() { $('#lightbox').fadeToggle(); });
  });


