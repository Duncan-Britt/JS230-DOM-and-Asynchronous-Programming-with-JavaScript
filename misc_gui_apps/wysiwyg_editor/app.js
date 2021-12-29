var App = {

  toggleBold: function(e) {
    document.execCommand('bold');
    this.toggleButton(e);
  },

  toggleItalic: function(e) {
    document.execCommand('italic');
    this.toggleButton(e);
  },

  toggleUnderline: function(e) {
    document.execCommand('underline');
    this.toggleButton(e);
  },

  toggleLink: function(e) {
    var selection = document.getSelection().toString();
    var url;
    if (!selection) return;

    url = prompt('Enter the URL to link to: ');
    this.createLink(url, e);
  },

  toggleStrikeThrough: function(e) {
    document.execCommand('strikeThrough');
    this.toggleButton(e);
  },

  createLink: function(url, e) {
    if (!url) return;
    document.execCommand('createLink', false, url);
    this.toggleButton(e);
  },

  insertUL: function(e) {
    document.execCommand('insertUnorderedList');
    this.toggleButton(e);
  },

  insertOL: function(e) {
    document.execCommand('insertOrderedList');
    this.toggleButton(e);
  },

  alignLeft: function(e) {
    document.execCommand('justifyLeft');
    this.toggleButton(e);
    this.toggleButtons();
  },

  alignRight: function(e) {
    document.execCommand('justifyRight');
    this.toggleButton(e);
    this.toggleButtons();
  },

  alignCenter: function(e) {
    document.execCommand('justifyCenter');
    this.toggleButton(e);
    this.toggleButtons();
  },

  alignJustify: function(e) {
    document.execCommand('justifyFull');
    this.toggleButton(e);
    this.toggleButtons();
  },

  // add 'pushed' class to button clicked
  toggleButton: function(e) {
    var $btn = $(e.target);
    $btn.toggleClass('pushed');
  },

  // add 'pushed' class to buttons whose actions are applied to current selection
  toggleButtons: function() {
    var isBold = document.queryCommandState('bold');
    var isItalic = document.queryCommandState('italic');
    var isUnderlined = document.queryCommandState('underline');
    var isStrokeThrough = document.queryCommandState('strikeThrough');
    var isALink = document.queryCommandState('createLink');
    var isAnOL = document.queryCommandState('insertOrderedList');
    var isAUL = document.queryCommandState('insertUnorderedList');
    var isAlignLeft = document.queryCommandState('justifyLeft');
    var isAlignRight = document.queryCommandState('justifyRight');
    var isAlignCenter = document.queryCommandState('justifyCenter');
    var isAlignJust = document.queryCommandState('justifyFull');

    $('.bold').toggleClass('pushed', isBold);
    $('.italicize').toggleClass('pushed', isItalic);
    $('.underline').toggleClass('pushed', isUnderlined);
    $('.strikethrough').toggleClass('pushed', isStrokeThrough);
    $('.link').toggleClass('pushed', isALink);
    $('.ul').toggleClass('pushed', isAUL);
    $('.ol').toggleClass('pushed', isAnOL);
    $('.al_left').toggleClass('pushed', isAlignLeft);
    $('.al_right').toggleClass('pushed', isAlignRight);
    $('.al_center').toggleClass('pushed', isAlignCenter);
    $('.al_justify').toggleClass('pushed', isAlignJust);
  },

  init: function() {
    $('button.bold').on('click', this.toggleBold.bind(this));
    $('button.italicize').on('click', this.toggleItalic.bind(this));
    $('button.underline').on('click', this.toggleUnderline.bind(this));
    $('button.link').on('click', this.toggleLink.bind(this));
    $('button.strikethrough').on('click', this.toggleStrikeThrough.bind(this));
    $('button.ul').on('click', this.insertUL.bind(this));
    $('button.ol').on('click', this.insertOL.bind(this));
    $('button.al_left').on('click', this.alignLeft.bind(this));
    $('button.al_right').on('click', this.alignRight.bind(this));
    $('button.al_center').on('click', this.alignCenter.bind(this));
    $('button.al_justify').on('click', this.alignJustify.bind(this));
    document.addEventListener('selectionchange', this.toggleButtons.bind(this));
  }
};

App.init();


// document.addEventListener('DOMContentLoaded', () => {
//   new Event('keydown')
//
//   document.querySelector('.fa-bold').addEventListener('click', handler);
//
//   function handler(e) {
//     console.log(e.target.dataset.command);
//     console.log(document.execCommand('bold'));
//   }
// });
