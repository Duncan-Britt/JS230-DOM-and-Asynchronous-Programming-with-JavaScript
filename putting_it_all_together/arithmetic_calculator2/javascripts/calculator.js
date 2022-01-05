$(function() {
  $n1 = $('#first-number');
  $n2 = $('#second-number');
  $op = $('#operator');
  $result = $('#result');

  $('form').on('submit', function(e) {
    e.preventDefault();

    $result.text(eval(`${$n1.val()} ${$op.val()} ${$n2.val()}`));
  });
});
