// simple button click event handler
function btnHandler(selector, callback) {
  var btn = document.querySelector(selector);
  if (!btn) { return; }
  btn.addEventListener('click', function (event) {
    event.preventDefault();
    callback();
  }, false);
}

function toggleDarkMode() {
  var html = document.getElementsByTagName('html');
  html[0].classList.toggle('dark');
}

