const close_btn = document.querySelector('.close-btn');

// Alert Message Function

export const alert_message = (message) => {
    close_btn.closest('.alert').querySelector('.alert-body').textContent = message;
    close_btn.closest('.alert').classList.remove('show');
    
    setTimeout(() => {
        close_btn.closest('.alert').classList.add('show');
    }, 3000);
};