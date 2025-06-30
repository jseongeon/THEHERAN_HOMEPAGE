document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bg-canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const particlesGeometry = new THREE.BufferGeometry();
  const count = 1000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({ size: 0.03, color: 0xffffff });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  const mouse = { x: 0, y: 0 };
  document.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(event.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    particles.rotation.y = elapsedTime * 0.1;
    particles.rotation.x += (mouse.y - particles.rotation.x) * 0.05;
    particles.rotation.y += (mouse.x - particles.rotation.y) * 0.05;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 📱 모바일 메뉴 toggle
  const toggleBtn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  let menuOpen = false;

  toggleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("translate-x-full");
    mobileMenu.classList.toggle("translate-x-0");
  });

  closeBtn?.addEventListener("click", () => {
    mobileMenu.classList.add("translate-x-full");
    mobileMenu.classList.remove("translate-x-0");
    menuOpen = false;
  });

  window.addEventListener("click", (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      mobileMenu.classList.add("translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
      menuOpen = false;
    }
  });

  // 💖 좋아요 버튼
  const likeButton = document.getElementById("like-button");
  const heartIcon = document.getElementById("heart-icon");
  const likeCount = document.getElementById("like-count");
  let liked = false;
  let initialLikes = parseInt(likeCount.textContent.replace("+", "")) || 0;

  likeButton?.addEventListener("click", () => {
    if (!liked) {
      liked = true;
      // initialLikes += 1;
      likeCount.textContent = initialLikes + "+";
      heartIcon.classList.add("text-pink-500", "scale-110");
    }
  });

  // 📝 타이핑 텍스트
  const typingTarget = document.getElementById("typing-text");
  const fullText = "특허법인 테헤란";
  const highlightWord = "테헤란";
  let currentIndex = 0;

  function typeChar() {
    if (currentIndex < fullText.length) {
      typingTarget.innerHTML += fullText[currentIndex];
      currentIndex++;
      setTimeout(typeChar, 180);
    } else {
      setTimeout(() => {
        const replaced = fullText.replace(
          highlightWord,
          `<span class="text-blue-highlight">${highlightWord}</span>`
        );
        typingTarget.innerHTML = replaced;
      }, 200);
    }
  }
  typeChar();

  // ✅ intro section fade-out + section 1 fade-in
  const introSection = document.getElementById("intro-section");
  const section1 = document.getElementById("section-1");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const winH = window.innerHeight;

    const ratio = Math.min(Math.max(scrollY / winH, 0), 1); // 0 ~ 1

    if (introSection && section1) {
      introSection.style.opacity = `${1 - ratio}`;
      section1.style.opacity = `${ratio}`;
    }
  });

  // 🌟 스크롤 시 fade-in 애니메이션
  const fadeEls = document.querySelectorAll(".fade-in-up, .fade-img");

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeEls.forEach(el => fadeObserver.observe(el));
});


// ✅ 숫자 카운트 애니메이션 (자동 증가폭 계산)
function animateCounter(el, target, duration = 1000) {
  let start = 0;
  const frameRate = 20; // 20ms마다 실행
  const totalFrames = Math.round(duration / frameRate);
  const step = Math.max(Math.round(target / totalFrames), 1); // 최소 1 이상

  const counter = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(counter);
    } else {
      el.textContent = start.toLocaleString();
    }
  }, frameRate);
}

function handleCountUp(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!el.classList.contains("counted")) {
        animateCounter(el, target, 800); // 필요하면 duration도 조절 가능
        el.classList.add("counted");
      }
    }
  });
}

const observer = new IntersectionObserver(handleCountUp, {
  threshold: 0.6,
});

document.querySelectorAll(".count-up").forEach((el) => observer.observe(el));

// 🖼️ 로고 슬라이드 애니메이션 삽입
document.addEventListener("DOMContentLoaded", () => {
  const logos = Array.from({ length: 43 }, (_, i) => `images/logo/logo${i + 1}.png`);
  const rows = document.querySelectorAll(".logo-row");
  const template = document.getElementById("logo-template");

  const chunkSize = Math.ceil(logos.length / 3);
  const chunkedLogos = [0, 1, 2].map(i => logos.slice(i * chunkSize, (i + 1) * chunkSize));

  rows.forEach((row, idx) => {
    const rowLogos = chunkedLogos[idx % chunkedLogos.length];

    // 2배로 반복해서 무한 슬라이드 느낌
    for (let i = 0; i < 2; i++) {
      rowLogos.forEach(src => {
        const clone = template.content.cloneNode(true);
        const img = clone.querySelector("img");
        img.src = src;
        img.alt = `로고 ${src}`;
        row.appendChild(clone);
      });
    }

    // 애니메이션 속도 커스텀 (data-speed 기준)
    const speed = row.dataset.speed || 35;
    row.style.animationDuration = `${speed}s`;
  });
});

//가로 슬라이드
const section = document.querySelector('.why-card-outer');
const track = document.querySelector('#cardTrack');
const cards = track?.children || [];

let targetX = 0;
let currentX = 0;

function animateSlideScroll() {
  const isDesktop = window.innerWidth >= 1024;

  if (!isDesktop) {
    track.style.transform = 'none';
    requestAnimationFrame(animateSlideScroll);
    return;
  }

  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;

  const cardCount = cards.length;
  const cardWidth = cards[0].offsetWidth;
  const gap = 48;
  const maxTranslate = (cardCount - 1) * (cardWidth + gap);

  if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight - viewportHeight) {
    const progress = (scrollY - sectionTop) / (sectionHeight - viewportHeight);
    targetX = -progress * maxTranslate;
  }

  currentX += (targetX - currentX) * 0.1;
  track.style.transform = `translateX(${currentX}px)`;

  requestAnimationFrame(animateSlideScroll);
}
requestAnimationFrame(animateSlideScroll);

//customer 섹션
function animateBarGauges() {
  document.querySelectorAll(".bar-fill").forEach(bar => {
    const target = parseInt(bar.dataset.target, 10);
    let current = 0;
    const interval = setInterval(() => {
      current += 0.5;
      bar.style.width = `${current}%`;
      if (current >= target) clearInterval(interval);
    }, 12);
  });

  const circle = document.getElementById("circle-gauge");
  let percent = 0;
  const circleInterval = setInterval(() => {
    percent += 0.5;
    circle.setAttribute("stroke-dasharray", `${percent}, 100`);
    if (percent >= 95.2) clearInterval(circleInterval);
  }, 8);
}

let gaugeAnimated = false;
window.addEventListener("scroll", () => {
  const section = document.getElementById("customer-satisfication");
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8 && !gaugeAnimated) {
    gaugeAnimated = true;
    animateBarGauges();
  }
});

// film 이미지 확대 세션
const filmSection = document.getElementById("film-section");
const filmImg = document.getElementById("film-img");

window.addEventListener("scroll", () => {
  if (!filmSection || !filmImg) return;

  const rect = filmSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top < windowHeight && rect.bottom > 0) {
    const progress = Math.min(Math.max((windowHeight - rect.top) / windowHeight, 0), 1);
    const scale = 1 + progress * 0.6;

    filmImg.style.transform = `scale(${Math.min(scale, 1.6)})`;
    filmImg.style.opacity = `${0.6 + 0.4 * progress}`;
  }
});
