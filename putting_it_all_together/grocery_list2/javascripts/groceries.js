$(function() {
  let $groc_list = $('#grocery-list');
  $('form').on('submit', function(e) {
    e.preventDefault();
    let $inputs = $(this).find('input[type="text"]');
    $groc_list.append(`<li>${$inputs.eq(1).val() || 1} ${$inputs.eq(0).val()}</li>`);
    $inputs.val('');
  });
});
