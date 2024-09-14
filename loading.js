document.addEventListener('DOMContentLoaded', function() {
    console.log('Script started');
    setTimeout(() => {
        console.log('Timeout finished, attempting to redirect');
        window.location.href = 'index.html';
    }, 3000);
});
