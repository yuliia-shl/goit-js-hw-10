import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateInputEl = document.querySelector('#datetime-picker')
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerInterval = null;
startButton.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] <= new Date()) {
            iziToast.error({
                position: 'topRight',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDates[0];
            startButton.disabled = false;
        }
      },
};
  
flatpickr(dateInputEl, options);

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

//Обновити таймер на екрані
function timerUpdateValue({ days, hours, minutes, seconds }) {
    daysValue.textContent = String(days).padStart(2, '0');
    hoursValue.textContent = String(hours).padStart(2, '0');
    minutesValue.textContent = String(minutes).padStart(2, '0');
    secondsValue.textContent = String(seconds).padStart(2, '0');
}

// Почати таймер
startButton.addEventListener('click', () => {
    if (!userSelectedDate) return;
    dateInputEl.disabled = true;
    startButton.disabled = true;

    timerInterval = setInterval(() => {
        const timeNow = new Date();
        const timeLeft = userSelectedDate - timeNow;
  
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerUpdateValue({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          document.querySelector('#datetime-picker').disabled = false;
          return;
        }
  
        const time = convertMs(timeLeft);
        timerUpdateValue(time);
    }, 1000);
});
