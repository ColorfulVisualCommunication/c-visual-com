var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos || prevScrollpos == currentScrollPos ) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-1080px";
  }
  prevScrollpos = currentScrollPos;
}


// logo carousel slick
$(document).ready(function(){
    $('.customer-logos').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 4
            }
        }, {
            breakpoint: 520,
            settings: {
                slidesToShow: 3
            }
        }]
    });
});
// logo carousel slick-end

// card hover effect
$(document).ready(function () {
    $('.hover-div').hover(function () {
        $('.hover-div').stop().fadeTo('fast', 0.3);
        $(this).stop().fadeTo('fast', 1);
    }, function () {
        $('.hover-div').stop().fadeTo('fast', 1);
    });
});

//  curosr-pointer effect
const cursor = document.getElementById('cursor');
const stalker = document.getElementById('stalker');

document.addEventListener('mousemove', (event) => {

  const x = event.clientX;
  const y = event.clientY;

  console.log('X coordinate:', x, 'Y coordinate:', y);

  cursor.style.transform = `translate(${x}px, ${y}px)`;
  stalker.style.transform = `translate(${x}px, ${y}px)`;
});
//  curosr-pointer effect-end

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const colors = ["#FF3F8E", "#04C2C9", "#2E55C1", "#FF6464", "#FFC33C"];

function Particle(x, y, color) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 15 + 1;
  this.color = color;
  this.speedX = Math.random() * 3 - 1.5;
  this.speedY = Math.random() * 3 - 1.5;
}

Particle.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;
  if (this.size > 0.2) this.size -= 0.1;
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};

function createParticle(e) {
  const xPos = e.x;
  const yPos = e.y;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const particle = new Particle(xPos, yPos, color);
  particles.push(particle);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].size <= 0.2) {
      particles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animateParticles);
}

function resizeCanvas() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}

document.addEventListener("mousemove", createParticle);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animateParticles();

// fade in grid items  ==================================

$(document).on("scroll", function () {
  var pageTop = $(document).scrollTop()
  var pageBottom = pageTop + $(window).height()
  var tags = $(".fadein")

  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i]

    if ($(tag).offset().top < pageBottom) {
      $(tag).addClass("visible")
    } else {
      $(tag).removeClass("visible")
    }
  }
})

$(document).on("scroll", function () {
  var pageTop = $(document).scrollTop()
  var pageBottom = pageTop + $(window).height()
  var tags = $(".in-down")

  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i]

    if ($(tag).offset().top < pageBottom) {
      $(tag).addClass("visible")
    } else {
      $(tag).removeClass("visible")
    }
  }
})

//validate form in contact us section
function validateForm() {
    var n = document.getElementById('name').value;
    var e = document.getElementById('email').value;
    var s = document.getElementById('subject').value;
    var m = document.getElementById('message').value;
    var onlyLetters =/^[a-zA-Z\s]*$/; 
    var onlyEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if(n == "" || n == null){
        document.getElementById('nameLabel').innerHTML = ('Please enter your name');
        document.getElementById('name').style.borderColor = "red";
        return false;
    }


    if (!n.match(onlyLetters)) {
        document.getElementById('nameLabel').innerHTML = ('Please enter only letters');
        document.getElementById('name').style.borderColor = "red";
        return false;
    }

    if(e == "" || e == null ){
          document.getElementById('emailLabel').innerHTML = ('Please enter your email');
          document.getElementById('email').style.borderColor = "red";
          return false;
      }

    if (!e.match(onlyEmail)) {
        document.getElementById('emailLabel').innerHTML = ('Please enter a valid email address');
        document.getElementById('email').style.borderColor = "red";
        return false;
    }

    if(s == "" || s == null ){
          document.getElementById('subjectLabel').innerHTML = ('Please enter your subject');
          document.getElementById('subject').style.borderColor = "red";
          return false;
      }

    if (!s.match(onlyLetters)) {
        document.getElementById('subjectLabel').innerHTML = ('Please enter only letters');
        document.getElementById('subject').style.borderColor = "red";
        return false;
    }

    if(m == "" || m == null){
        document.getElementById('messageLabel').innerHTML = ('Please enter your message');
        document.getElementById('message').style.borderColor = "red";
        return false;
    }

    else{
          return true;
      }

}