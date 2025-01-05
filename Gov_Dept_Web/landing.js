// script.js
const slider = document.querySelector('.news-container');

slider.addEventListener('mouseover', () => {
  slider.style.animationPlayState = 'paused';
});

slider.addEventListener('mouseout', () => {
  slider.style.animationPlayState = 'running';
});
