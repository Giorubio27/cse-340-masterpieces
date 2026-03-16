document.getElementById('countdown');

const startTime = 10; // Starting time in seconds
let timeLeft = startTime;

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {
    const countdownInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('countdown').textContent = timeLeft;
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);
});