/* ---------------------------------------------------------
 * The order of these functions is intended to promote graceful failure if
 * the script processing gets delayed.
 * --------------------------------------------------------- */

/* ---------------------------------------------------------
 * TOC
 * ---------------------------------------------------------
 * - Polyfills
 * - NR browser prep
 * Added page elements
 * - Page content menu generator
 * - Location flagging
 * - Flag current page in menu
 * - Add external link icons
 * Collapsers and cleanup
 * - Remove blank line for the top of code blocks
 * - Collapse long menus with a more link
 * - Form management
 *   - Comments form
 *   - Review form (not in use, we could probably kill)
 * - Clamshell menus
 *   - Collapsers and event handles
 *   - Scroll tweaks
 *   - Assign hotkeys
 * Fixes
 * - Scald bugs
 * - Apache .Net bugs
 * - Mollom bugs
 * - Mollom form cleanup
 * Lightbox
 */

/**
 * Polyfills to ensure browers compatibility.
 */
if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}


/* --------------------------------------------------------- */
jQuery(document).ready(function($) {

var loggedIn = ( $('body').hasClass('logged-in') ) ? true : false;


/* ---------------------------------------------------------
 * Sidebar nav and responsive scripts
 * --------------------------------------------------------- */

// Set height of sidebar dynamically

// Detect if element is in view and how far away from top it is. Used to dynamically calculate sidebar height
function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */ 
      ) {

      return rect.top;

    }
    else {
    return false;  
    };
}

// Change sidebar nav toggle button text

function setSidebarToggleLabel (action) {
  if (action=='listen') { // Set the bs event listener again again
    $('#sidebar-first').on('hide.bs.collapse', function (e) {
    $('.sidebar-heading .label').removeClass('open').addClass('closed');
    });
    $('#sidebar-first').on('show.bs.collapse', function (e) {
      $('.sidebar-heading .label').removeClass('closed').addClass('open');
    });
  }
  else if (action==false) { // Change label on calling the function
    if ( $('.sidebar-heading .label').hasClass('open') ) {
      $('.sidebar-heading .label').removeClass('open').addClass('closed');
    }
    else if ( $('.sidebar-heading .label').hasClass('closed') ) {
      $('.sidebar-heading .label').removeClass('closed').addClass('open');
    }
  }
}

setSidebarToggleLabel('listen');

// Adjust column layout and sidebar height if on screen bigger than tablet when using sidebar toggle

$('.sidebar-toggle').click(function() {
  if ($(window).width() > 991) {
    if ( ! $(this).hasClass('collapsed') ) {
      $('#main .col').first().removeClass('col-md-4').addClass('col-md-1 sidebar-sm-width');
      $('#main .col').last().removeClass('col-md-8').addClass('col-md-11 main-col-move-left');
    }
    if ( $(this).hasClass('collapsed') ){ 
      $('#main .col').first().removeClass('col-md-1 sidebar-sm-width').addClass('col-md-4');
      $('#main .col').last().removeClass('col-md-11 main-col-move-left').addClass('col-md-8');
    }  
  }
})


// Set sidebar height dynamically when lower csat comes into view
$(window).scroll(function() {
  if ($(window).width() > 991) {
    if (isElementInViewport( $('#lower-csat') )) {
      var sidebarHeight = isElementInViewport( $('#lower-csat') );
      if (loggedIn == true) { sidebarHeight -= 39; } // subtract height of admin bar
      $('#sidebar-nav').height(sidebarHeight);
    }
    else {$('#sidebar-nav').height(1300);}
  }
});

// Hide sidebar nav on page load on smaller screens, change class for button text
if ($(window).width() < 991) {
  $('#sidebar-nav').height('inherit');
  $('#sidebar-first').removeClass('collapse in');
  $('.sidebar-heading .label').removeClass('open').addClass('closed');
}

$('nav.sidebar').affix({
  offset: {
    top: 150
  }
});
$('#upper-csat').affix({
  offset: {
    top: 150
  }
});
// If authenticated person with admin bar at top, offset
$('nav.sidebar, #upper-csat').on('affix.bs.affix', function(event){
  ($('body').hasClass('logged-in')) ? $('nav.sidebar, #upper-csat').addClass('logged-in') : false;
});

// On window resize, collapse sidebar and remove any dynamically set height

$( window ).resize(function() {
  if ($(window).width() < 991) {
    $('#sidebar-first').collapse('hide');
    $('#sidebar-nav').height('inherit');
  }
  if ($(window).width() > 991) {
    $('#main .col').first().removeClass('col-md-1 sidebar-sm-width').addClass('col-md-4');
    $('#main .col').last().removeClass('col-md-11 main-col-move-left').addClass('col-md-8');
    $('#sidebar-first').collapse('show');
    $('#sidebar-nav').height(1300);
  }
});

// Makes all tables responsive by wrapping them in bootstrap div, adding class

if ($('table')) {
  $('table').each( function() {
    $(this).wrap('<div class="table-responsive"></div>');
    $(this).addClass('table');
  });
}

/* ---------------------------------------------------------
 * Add page elements
 * --------------------------------------------------------- */

/**
 * Page content menu generator.
 *
 * This routine automates the table of contents for jump links internal to pages.
 * A menu is inserted after an H2 with id="qiklinks".
 * The menu includes all H2 elements in the document.
 * If an H2 element does not have an ID assigns one.
 * Script assumes the contents are titled "Contents".
 * Script checks for the class 'freq-link" to include H3 and DT elements.
 */
  var menuList = '';
  // don't include these in menu
  var h2System = ['Status message', 'Quick links', 'Contents', 'Search form', 'Internal notes'];
  var h2Listing = $('#content').find('h2');
  var h2Length = h2Listing.length;
  for (var i=0; i<h2Length; i++) {
    var h2This      = h2Listing.eq(i);
    var h2ThisText  = h2This.text();
    var subMenuList = '';
    if ((jQuery.inArray(h2ThisText, h2System) == -1) && h2ThisText) {
      if (!(h2This.is('[id]'))) { h2This.attr('id', 'h2-'+h2ThisText.replace(/ /g,'-')); }
      menuList += '<li id="jumpto-'+h2This.attr('id')+'" class="page-contents"><a href="#'+h2This.attr('id')+'">'+h2ThisText+'</a>';
      // add quick links for h3 + dt elements
      var flListing = h2This.nextUntil('h2','h3, dl');
      var flLength = flListing.length;
      for (var j=0; j<flLength; j++) {
        var flThis = flListing.eq(j);
        if (flThis.hasClass('freq-link')) {
          if (!(flThis.is('[id]'))) {
            flThis.attr('id', 'h3-'+flThis.text().replace(/ /g,'-'));
          }
          subMenuList += '<li><a href="#'+flThis.attr('id')+'">'+flThis.text()+'</a></li>';
        }
        var fl2Listing = flThis.children('.freq-link');
        var fl2Length = fl2Listing.length;
        for (var k=0; k<fl2Length; k++) {
          var fl2This = fl2Listing.eq(k);
          if (!(fl2This.is('[id]'))) {
            fl2This.attr('id', 'dl-'+fl2This.text().replace(/ /g,'-'));
          }
          subMenuList += '<li><a href="#'+fl2This.attr('id')+'">'+fl2This.text()+'</a></li>';
        }
      }
      if (subMenuList) { subMenuList = '<ul>'+subMenuList+'</ul>'; }
      menuList += subMenuList;
      menuList += '</li>';
    }
  }
  //$('#qiklinks').after('<ul id="jumpto" />');
  //$('#jumpto').append(menuList); Append to current_loc instead



/**
 * Flag the current page in the menu. Remove url check to make it work in jsfiddle
 */
 
 // Temporary line to add it for jfiddle because no url available
 $('aside#sidebar-first-docs').find('li.current_loc').append(menuList);
 
  var current_path  = window.location.pathname;
  // page menus
  var sidebarEl     = $('aside#sidebar-first-docs').find('a');
  var sidebarLength = sidebarEl.length;
  for (var i=0; i<sidebarLength; i++) {
    var sidebarThis = sidebarEl.eq(i);
    if (sidebarThis.attr('href') == current_path) {
      sidebarThis.addClass('current_loc');
      sidebarThis.closest('li').addClass('current_loc nav').append(menuList);
    }
  }

  // taxonomy menus
      sidebarEl     = $('div.region-sidebar-first').find('div.view-categories-menu a');
      sidebarLength = sidebarEl.length;
  for (var i=0; i<sidebarLength; i++) {
    var sidebarThis = sidebarEl.eq(i);
    if (sidebarThis.attr('href') == current_path) {
      sidebarThis.addClass('current_loc');
      sidebarThis.closest('li').addClass('current_loc');
    } else if (current_path.contains(sidebarThis.attr('href'))) {
      sidebarThis.addClass('current_loc');
      sidebarThis.closest('li').addClass('current_loc');
    }
  }
  // Scroll sidebar nav to doc being viewed
  if ($('li.current_loc')) {
    $('li.current_loc').parent('ul').addClass('in');
    $('nav.sidebar').scrollTop( $('li.current_loc').offset().top-100);
    $('li.current_loc').parent().prev('h3').children('.fa').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
  }
  $('.collapse-toggle').click(function(e) {
    $('#sidebar-first').off(); // Turn off bs listener that changes toggle text because of bs nested collapse propagation bug
    $(this).next('.collapse').collapse('toggle');
    ($(this).children('.fa').hasClass('fa-minus-square-o')) ? $(this).children('.fa').removeClass('fa-minus-square-o').addClass('fa-plus-square-o') : $(this).children('.fa').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
    $('#sidebar-first').on('hide.bs.collapse, show.bs.collapse', setSidebarToggleLabel('listen') );
  });

/**
 * Add icon and target to external links.
 */
  if ($('ol.search-results').length == 0) {
    // pages
    var externalEl     = $('#main-wrapper #content').
    find('a[href^="https:"], a[href^="http:"], a[href^="ftp:"], a[href^="//"]').
    not('a[href*="docs.newrelic.com"]','a[href*="newrelicdev"]','a[href*="newrelicstg"]');
    var externalLength = externalEl.length;
    for (var i=0; i<externalLength; i++) {
      var externalThis = externalEl.eq(i);
      externalThis.filter(':not(:has(i))').append(' <i class="fa fa-external-link fileinfo"><span>[external link]</span></i> ');
      externalThis.attr('target', '_blank');
      externalThis.attr('title', 'Link opens in a new window.');
    }
    // articles
    var externalEl     = $('#main-wrapper article').
    find('a[href^="https:"], a[href^="http:"], a[href^="ftp:"], a[href^="//"]').
    not('a[href*="docs.newrelic.com"]');
    var externalLength = externalEl.length;
    for (var i=0; i<externalLength; i++) {
      var externalThis = externalEl.eq(i);
      externalThis.attr('target', '_blank');
      externalThis.attr('title', 'Link opens in a new window.');
    }
  }
/* ------------------------------------------------------
Button to copy <pre> text to clipboard using clipboard.js
---------------------------------------------------------
*/
if ($('pre')) {
  var a = 1;
  $('pre').each(function () {
    var preId = 'pre'+a; // Set initial counter for unique IDs
    $(this).prepend('<button data-clipboard-target="#'+preId+'" class="copy-text btn btn-sm" title="Copy to clipboard" data-text=" Copy"></button>');
    $(this).attr('id', preId);
    a ++; // Increment counter
  });
  $('.copy-text').click(function (){
      var preText = $(this).closest('pre').text();
      var clipboard = new Clipboard ('.copy-text', {target: preText});
      clipboard.on('success', function(event) {
        event.trigger.attributes['data-text']['value'] = ' Copied';
        window.setTimeout(function() {
          event.trigger.attributes['data-text']['value'] = ' Copy';
          }, 2000);
        //event.clearSelection();
        if (typeof newrelic == 'object') {
          newrelic.addPageAction('copy-text-button', {result: 'success'});
        }
        if(typeof ga == 'function') {
          ga('send', 'event', 'copy-text-button', 'success');
        }
      });
      clipboard.on('error', function(event) { 
        event.trigger.attributes['data-text']['value'] = ' Press "Ctrl/Cmd + C" to copy';
        window.setTimeout(function() {
          event.trigger.attributes['data-text']['value'] = ' Copy';
        }, 2000);
        if (typeof newrelic == 'object') {
          newrelic.addPageAction('copy-text-button', {result: 'error'});
        }
        if(typeof ga == 'function') {
          ga('send', 'event', 'copy-text-button', 'error');
        }
      });
  });
}

/* ---------------------------------------------------------
 * Collapse out excess content
 * --------------------------------------------------------- */

  /**
 * Remove leading linebreaks from code blocks.
  */
  $('pre code').each(function () { $(this).text($(this).text().replace(/^\n+|\n+$/g, "")); });

/**
 * Menu collapser.
 *
 * This removes items from long menus and replaces them with a more button.
 * Currently it only works on main content menus, not on side menus.
 */

// LOAD: find long lists
  var li_limit = 4; // n-1, :gt func counts from zero
  var li_loc = 'release-notes';
  if (window.location.href.indexOf("release-notes") > -1) {
    $('div.view-taxonomy-term div.subcategory-menu').find('ul').each(function () {
      if ($(this).children().length > li_limit) {
        $(this).find('li:gt('+li_limit+')').hide();
      }
      var dest_loc = $(this).find('li:first-child a').attr('href');
      var dest_trunc = dest_loc.lastIndexOf('/');
      dest_trunc = dest_trunc == -1 ? dest_loc.length : dest_trunc;
      dest_loc = dest_loc.substring(0, dest_trunc);
      $(this).append('<li class="link-more"><a href="'+dest_loc+'">&rarr; view full history</a></li>');
    });
  }

/* -- Form management -------------------- */

/**
 * Comments form.
 */

// LOAD: add comments links
  var commentFormWrapper = $('#comment-form-wrapper');
  commentFormWrapper.find('h3').each(function () {
    $(this).prepend('<span class="right-link"><i class="fa fa-toggle-right more-link"></i></span>');
  });

// LOAD: hide comments form
  commentFormWrapper.children('form').hide();

// EVENT: open comment form
  commentFormWrapper.find('h3').click(function(event) {
    var togType = ($(this).find('i span').text() == '[show details]') ? true : false;
    $(this).find('i span').text(togType ? '[hide details]' : '[show details]');
    $(this).find('i').toggleClass('fa-toggle-right fa-toggle-down');
    $(this).next().toggle(200);
    return false;
  });

// EVENT: open feedback comment form
  $('#csat-comments-button').click(function(event) {
    var togType = ($(this).text() == 'show comments') ? true : false;
    $(this).text(togType ? 'hide comments' : 'show comments');
    $(this).parent().parent().next().toggle(200);
    return false;
  });

/**
 * Review form.
 */

// LOAD: add review links
  editAndReviewNotes = $('div.field-name-field-edit-and-review-notes');
  editAndReviewNotes.find('div.field-label').each(function () {
    $(this).prepend('<span class="right-link"><i class="fa fa-list more-link"><span>[show details]</span></i></span>');
  });

// LOAD: hide review form
  editAndReviewNotes.children('div.field-items').hide();

// EVENT: open fold on direct select
  editAndReviewNotes.find('div.field-label').click(function(event) {
    var togType = ($(this).find('i span').text() == '[show details]') ? true : false;
    $(this).find('i span').text(togType ? '[hide details]' : '[show details]');
    $(this).next().toggle();
    return false;
  });

/* -- Clamshell ------------------------ */

/**
 * Clamshell creator.
 *
 * This accordion folds:
 *  - Any DL with a class of 'clamshell-list'
 *  - The comments form at the bottom of the page
 * All elements are collapsed and accordion links added.
 * An open all link added to the top of each list.
 * If the URL has a hash for a list item that item is opened and the page shifted
 * to the top of the list item.
 * Toggles manage individual list items or list as a whole.
 * Hot key to open: S or F.
 * Hot key to close: H.
 */
  var clamshellList = $('dl.clamshell-list, dl.example-box');
  // LOAD: add list item links
    clamshellList.find('dt').each(function () {
      $(this).prepend('<span class="right-link"><a class="more-link" href="#'+$(this).attr('id')+'" title="'+$(this).text()+'"><i class="fa fa-toggle-right"><span>[show details]</span></i></a></span>');
    });

  // LOAD: Add list headers and hide/show all links
  $(clamshellList).each(function () {
    $(this).prepend('<dt class="list-header"><span class="right-link"><a class="all-link" href="#all-links" title="show all"><b>Show All</b> &nbsp; <i class="fa fa-list"></i></a></span> </dt>');
    if ($(this).hasClass('example-box')) {
      if ( $(this).children('dt').length > 2 ) {
        $(this).children('dt.list-header').addClass('multi');
      }
    }
  });

  // LOAD: open list item on direct link to it in URL
    if (($(clamshellList)) && (location.hash!='')) {
      var clamshellTarget = location.hash;
      // LOAD: hide all list items except anchored dd
      clamshellList.find('dd').not(clamshellTarget).hide();
        if ($(clamshellTarget).length) {
          $(clamshellTarget).find('.more-link').find('i').addClass('fa fa-toggle-down').removeClass('fa-toggle-right');
          $(clamshellTarget).find('.more-link').find('i span').text('[hide details]');
          $(clamshellTarget).closest('dt').next('dd').toggle(500);
          if ( $(clamshellTarget).parents('dd') ) {
            $(clamshellTarget).parents('dd').prev().find('.more-link').find('i').addClass('fa fa-toggle-down').removeClass('fa-toggle-right');
            $(clamshellTarget).parents('dd').prev().find('.more-link').find('i span').text('[hide details]');
            $(clamshellTarget).parents('dd').toggle(500);
          }
          $('html, body').scrollTop($(clamshellTarget).offset().top-50);
        }
    }
    else { // LOAD: hide all dd's cuz no anchor in URL
      if ($(clamshellList)) { clamshellList.find('dd').hide(); }
    }

  // EVENT: open target fold for internal link
  $(window).on('hashchange', function(e){
    if (($(clamshellList)) && (location.hash!='')) {
      var clamshellTarget = location.hash;
      if ( $(clamshellTarget).is(':hidden') ) {
        $(clamshellTarget).parents('dd').show();
      }
      $(clamshellTarget).find('a.more-link i span').text('[hide details]');
      $(clamshellTarget).find('a.more-link i').toggleClass('fa-toggle-right fa-toggle-down');
      $(clamshellTarget).next('dd').show(500);
    }
  });

  // EVENT: open fold on direct select
  $(clamshellList).on('click', 'a.more-link', function(event) {
    var togType = ($(this).find('i span').text() == '[show details]') ? true : false;
    $(this).find('i span').text(togType ? '[hide details]' : '[show details]');
    $(this).find('i').toggleClass('fa-toggle-right fa-toggle-down');
    $(event.target).closest('dt').next('dd').toggle(500);
    return false;
  });

// EVENT: open all folds on direct select
  $(clamshellList).on('click', 'a.all-link', function(event) {
    var togType = ($(this).find('b').text() == 'Show All') ? true : false;
    $(event.target).closest('dl').children('dd').toggle(500);
    $(this).find('b').text(togType ? 'Hide All' : 'Show All');
    $(event.target).closest('dl').children('dt').find('a.more-link i span').text(togType ? '[hide details]' : '[show details]');
    $(event.target).closest('dl').children('dt').find('a.more-link i').attr('class', togType ? 'fa fa-toggle-down' : 'fa fa-toggle-right');
    return false;
  });

/**
 * Assign hotkeys and bootstrap button toggle
 */
  $('#bs-vis-toggle-all').click(function(){
    if ($(this).hasClass('tog-hide')) { // to show all
      $(this).text('Hide All');
      if ($('.in')){ // Fix BS bug where it toggles elements with .in
        $('.in').each(function(){
          $(this).removeClass('in');
        })
      }
      $('#content .collapse').collapse('show');
      $(this).removeClass('tog-hide').addClass('tog-show');
    }
    else if ($(this).hasClass('tog-show')) { // to hide all
      $(this).text('Show All');
      $('#content .collapse').collapse('hide');
      $(this).removeClass('tog-show').addClass('tog-hide');
    }
  });
  jQuery(document).on('keydown', function (e) {
    if ($('dl.clamshell-list, dl.example-box, div.collapse') && !($('input, textarea').is(":focus"))) { // will fire on sidebar collapsed categories
      if ((e.ctrlKey && e.keyCode == 70 ) || (e.keyCode == 70) || (e.keyCode == 83)  ) {
        $('#content .collapse').collapse('show');
        if ($('#bs-vis-toggle-all')) { // if bs toggle button, change its state too
          $('#bs-vis-toggle-all').text('Hide All').removeClass('tog-hide').addClass('tog-show');
        }
        clamshellList.find('dd').show(200);
        $('.more-link').find('i').attr('class', 'fa fa-toggle-down');
        $('.more-link').find('i span').text('[hide details]');
        clamshellList.find('.all-link b').text('Hide All');
      }
      if (e.keyCode == 72) {
        $('#content .collapse').collapse('hide');
        if ($('#bs-vis-toggle-all')) { // if bs toggle button, change its state too
          $('#bs-vis-toggle-all').text('Show All').removeClass('tog-show').addClass('tog-hide');
        }
        clamshellList.find('dd').hide(200);
        $('.more-link').find('i').attr('class', 'fa fa-toggle-right');
        $('.more-link').find('i span').text('[show details]');
        clamshellList.find('.all-link b').text('Show All');
      }
    }
    if (e.keyCode == 27) { $('#lightbox').fadeOut(); }
  });

// LOAD:  Scroll tweak. Should run last
  $(window).on('hashchange', function(e){
    if (location.hash!='') {
      var topTarget = location.hash;
      if ($(topTarget).length) { $('html, body').scrollTop($(topTarget).offset().top-50); }
    }
  });

/* ---------------------------------------------------------
 * Fixes and workarounds.
 * --------------------------------------------------------- */

/**
 * SCALD "bug" fix.
 *
 * SCALD has a "bug" that enables inline edit mode for anyone with edit rights in all view modes.
 */

  $('.dnd-legend-wrapper').removeAttr('contentEditable');
  $('.dnd-legend-wrapper .meta').removeAttr('contentEditable');
  $('.field-widget-text-with-summary .dnd-legend-wrapper .meta').attr('contentEditable', true);

/**
 * Fix of the Apache .NET problem.
 *
 * Apache security breaks clean URLs for search because you can't view a file
 * or folder whose name begins with a period. This means searching for '.NET'
 * will throw an error as it returns a URL of /serch/node/.NET
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

/**
 * Mollom "bug" fix.
 *
 * Mollom has a "bug" that causes it to think an optional comments field is spam when blank.
 * This fixes that by leaving a defaul message in place.
 */
  mollom_pleaser = 'Comments optional (but appreciated).';
  $('form.webform-client-form-5726 textarea').focus(function() {
    if ($(this).val() == mollom_pleaser) { $(this).val(''); }
  });
  $('form.webform-client-form-5726 textarea').blur(function() {
    if ($(this).val() == '') { $(this).val(mollom_pleaser); }
  });

/* -------------------------------------
 * Processes for CSAT feedback form.
 */

/*
 * Change top CSAT location field for reporting.
 */
  $('div#upper-csat').find('div.webform-component--form-location input').attr('value', 'top');

  // Hack to hide toggle submit button display on input click
  $('#edit-submitted-feedback-helpfulness-1, #edit-submitted-feedback-helpfulness-2').click( function() {
    $('#webform-client-form-5726 div.form-actions').show();
  });

/*
 * Remove the CSAT form on submit.
 */
  if ($('div.status p span:contains("Thanks for your feedback.")').length > 0) {
    $('form.webform-client-form-5726').replaceWith('<p><b>Success!</b> Thank you for your feedback.</p>\n<p style="font-size: 0.85em;"><strong>Note:</strong> This feedback form exists solely to improve the quality of our documentation. If you need help with New Relic products or want responses to your questions, please see our <a href="//support.newrelic.com/home" target="_blank" title="Link opens in a new window.">support site <i class="fa fa-external-link fileinfo"><span>[external link]</span></i> </a>.</p>\n<div class="webform-component--clear-confirmation"><p><a href="#" class="dismiss-form">Dismiss</a></p></div>');
  }

/*
 * Prevent submission on click spamming.
 */
  $('form.webform-client-form-5726').on('submit',function(e){
    var $form = $(this);
    if ($form.data('submitted') === true) {
      // Previously submitted - don't submit again
      e.preventDefault();
    } else {
      // Mark it so that the next submit can be ignored
      $form.data('submitted', true);
    }
  });

/**
 * Clear CSAT confirmation after submission
 *
 * For some reason neither preventDefault or return false are working here.
 * So the turn false is hard coded into the trigger link as well.
 */
  $('div#upper-csat, div#lower-csat').find('a.dismiss-form').on('click',function(e){
    $('div#upper-csat, div#lower-csat, div.status, .form-actions').toggle();
    e.preventDefault();
    return false;
  });

/**
 * Reset form
 *
 * Yes, this is a horrible hack specific to the CSAT feedback form.
 * It creates a hidden 'dummy' radio button  to uncheck all other radio
 * buttons in the set in a way that triggers the WebForm module scripts.
 * It was easier than parsing through the module scripts to determine the
 * right triggers.
 * Steps:
 * - Add radio button.
 *   This included tha parent division because the WEbForm scripts appear to
 *   be listening to a specific DOM chain. not the radio buttons themselves.
 * - Generated click event on radio button.
 * - Remove radion button.
 */
  $('form.webform-client-form-5726').find('a.reset').on('click', function (e) {
    $('#webform-client-form-5726 div.form-actions').hide();
    $(this).closest('form').find('.form-radios').append('<div class="form-item form-type-radio form-item-submitted-feedback-helpfulness" style="display: none;"><input required="required" type="radio" id="edit-submitted-feedback-helpfulness-3" name="submitted[feedback_helpfulness]" value="0" class="form-radio dummybox" /></div>');
    var target = $(this).closest('form').find('.dummybox');
    target.click();
    target.parent().remove();
    e.preventDefault();
    return false;
  });

/**
 * Display top form after a short delay to allow cleanup time.
 */
  setTimeout(function () { $('div#upper-csat').show(500); }, 250);

/**
 * Hide duplicate feedback messages.
 */
  $('div.messages').find('span:contains("Thanks for your feedback")').closest('div').remove();

/* ---------------------------------------------------------
 * Processses with background tasks that should run last.
 * --------------------------------------------------------- */

/**
 * Lightbox script.
 *
 * Automatically applies itself to any image loaded as inline_660px.
 * This is a background task and should be the last thing in this library.
 *
 * Caution: Script needs to be rewritten so #lightbox can be cached.
 */
  var contextInlineImage = $('div.context-inline_image');

  // preload limages
  contextInlineImage.each(function(k, v) {
    rev = $(this).find('img').attr('src').replace('inline_660px','full_size');
    $('<img/>')[0].src = rev;
  });

  contextInlineImage.find('img').on('click', function(e) {
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
  $('body').on('click', '#lightbox', function() { $('#lightbox').fadeToggle(); });
});

