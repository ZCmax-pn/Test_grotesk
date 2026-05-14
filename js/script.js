const openBtn = document.getElementById('menu-open');
const modal = document.getElementById('modal-menu');

// Переключаем меню
openBtn.addEventListener('click', () => {
  modal.classList.toggle('modal-menu--open');
  document.body.classList.toggle('menu-open');
});

// Закрытие при клике на тёмный фон
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('modal-menu--open');
    document.body.classList.remove('menu-open');
  }
});

// Закрытие при Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.remove('modal-menu--open');
    document.body.classList.remove('menu-open');
  }
});

document.querySelectorAll('.modal-menu__link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      modal.classList.remove('modal-menu--open');
      document.body.classList.remove('menu-open');
      if (target) {
        // ждём небольшую паузу, пока меню закроется и body снова сможет скроллиться
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    } else {
      modal.classList.remove('modal-menu--open');
      document.body.classList.remove('menu-open');
    }
  });
});
// Переключение темы (светлая / тёмная) при нажатии на свитч
const themeToggleCheckbox = document.querySelector('.toggle__input');
const heroBlock = document.querySelector('.hero__block');

if (themeToggleCheckbox) {
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (heroBlock) heroBlock.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Восстанавливаем сохранённую тему при загрузке
  const savedTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  themeToggleCheckbox.checked = savedTheme === 'dark';
  applyTheme(savedTheme);

  // Слушаем изменение свитча
  themeToggleCheckbox.addEventListener('change', (e) => {
    applyTheme(e.target.checked ? 'dark' : 'light');
  });
}
const track = document.querySelector('[data-slider-track]');
const prevBtn = document.querySelector('.slider-nav-btn--prev');
const nextBtn = document.querySelector('.slider-nav-btn--next');
const slider = document.querySelector('.slider');

let currentIndex = 0;
const slides = Array.from(track.children);
const gap = 20; 

// Функция для получения количества видимых карточек
function getVisibleSlides() {
    const sliderWidth = slider.clientWidth;
    const slideWidth = slides[0].offsetWidth;
    return Math.floor(sliderWidth / (slideWidth + gap));
}

// Функция для получения максимального индекса
function getMaxIndex() {
    const visibleSlides = getVisibleSlides();
    return Math.max(0, slides.length - visibleSlides);
}

// Функция обновления позиции слайдера
function updateSlider() {
    const slideWidth = slides[0].offsetWidth;
    const translateX = -(currentIndex * (slideWidth + gap));
    track.style.transform = `translateX(${translateX}px)`;
}

// Следующий слайд
function nextSlide() {
    const maxIndex = getMaxIndex();
    
    if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
    } else {
        // Возвращаемся в начало
        currentIndex = 0;
        updateSlider();
    }
}
// Предыдущий слайд
function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    } else {
        // Переходим в конец
        const maxIndex = getMaxIndex();
        currentIndex = maxIndex;
        updateSlider();
    }
}

// Обновление при изменении размера окна
window.addEventListener('resize', () => {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    updateSlider();
});

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
// Скролл к произвольному блоку
document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSelector = btn.dataset.scrollTo;
        const target = document.querySelector(targetSelector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Маска для телефона
document.querySelectorAll('[data-mask="phone"]').forEach((input) => {
    const format = (digits) => {
        // Нормализуем: первой цифрой должна быть 7 (наш код страны)
        if (digits.length === 0) return '';
        if (digits[0] === '8') digits = '7' + digits.slice(1);
        if (digits[0] !== '7') digits = '7' + digits;
        digits = digits.slice(0, 11);

        let out = '+7';
        if (digits.length > 1) out += ' (' + digits.slice(1, 4);
        if (digits.length >= 4) out += ')';
        if (digits.length >= 5) out += ' ' + digits.slice(4, 7);
        if (digits.length >= 8) out += '-' + digits.slice(7, 9);
        if (digits.length >= 10) out += '-' + digits.slice(9, 11);
        return out;
    };

    input.addEventListener('input', (e) => {
        const digits = e.target.value.replace(/\D/g, '');
        e.target.value = format(digits);
    });

    // При фокусе — если поле пустое, сразу подставляем "+7 "
    input.addEventListener('focus', (e) => {
        if (!e.target.value) e.target.value = '+7 ';
    });

    // При уходе с фокуса, если оставили только "+7 " — очищаем,
    input.addEventListener('blur', (e) => {
        if (e.target.value.replace(/\D/g, '').length <= 1) e.target.value = '';
    });
});

// Отправка формы
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(contactForm));
        console.log('Form data:', data);
        alert('Спасибо! Форма отправлена.');
        contactForm.reset();
    });
}