const close_btn = document.querySelector('.close-btn');

export const alert_message = function (message) {
  close_btn.closest('.alert').querySelector('.alert-body').textContent = message;
  close_btn.closest('.alert').classList.remove('show');

  setTimeout(function () {
    close_btn.closest('.alert').classList.add('show');
  }, 3000);
};