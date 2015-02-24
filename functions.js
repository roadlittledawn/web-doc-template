
jQuery(document).ready(function() {
  jQuery(".target-collapse").hide();
  //toggle the componenet with class msg_body
  jQuery(".heading-collapse").click(function()
  {
    jQuery(this).next(".target-collapse").slideToggle(5);
  });
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


// clamshell hotkeys
$(document).ready(function($) {
  $(document).on('keydown', function (e) {
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
});
