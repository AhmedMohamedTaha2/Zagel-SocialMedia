// import 'animate.css';
let bttn = document.querySelector(".bttn");
document.addEventListener("DOMContentLoaded", function () {
    var options = {
        strings: [
          "Zagel is social media platform that combines the legacy of carrier pigeons with synthwave aesthetics, crafted for Arabic-speaking Youth"
        ],
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 1500,
        startDelay: 500,
        loop: false,  // Set loop to false to make sure it finishes once
        showCursor: true,
        cursorChar: '',
        onComplete: function() {
            bttn.classList.remove("hidden");  // Remove the hidden class when typing finishes
        }
    };

    var typed = new Typed('.typed-text', options);
});
// ============================================================
const pills = new mdb.Tab(document.querySelectorAll('.nav-link'));
document.addEventListener('DOMContentLoaded', function () {
    var pills = document.querySelectorAll('.nav-link');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function (e) {
        e.preventDefault();
        var tabId = this.getAttribute('href');
        document.querySelector('.tab-pane.show').classList.remove('show', 'active');
        document.querySelector(tabId).classList.add('show', 'active');
        pills.forEach(function (p) {
          p.classList.remove('active');
        });
        pill.classList.add('active');
      });
    });
  });
  
    