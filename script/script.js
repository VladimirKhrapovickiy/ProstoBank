'use strict';

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
const nav = document.querySelector('.nav');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

/////////////Modal window
const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModalWindow.forEach(e => {
  e.addEventListener('click', openModalWindow);
});

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

/////////////Scroll on click - old and new (best) practice

btnScrollTo.addEventListener('click', e => {
  //   const section1Coords = section1.getBoundingClientRect();
  //   window.scrollTo({
  //     left: section1Coords.left + window.pageXOffset,
  //     top: section1Coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(HTMLelement => {
//   HTMLelement.addEventListener('click', function (element) {
//     element.preventDefault();
//     document
//       .querySelector(this.getAttribute('href'))
//       .scrollIntoView({ behavior: 'smooth' });
//   });
// });

document
  .querySelector('.nav__links')
  .addEventListener('click', function (element) {
    element.preventDefault();

    if (element.target.classList.contains('nav__link')) {
      document
        .querySelector(element.target.getAttribute('href'))
        .scrollIntoView({ behavior: 'smooth' });
    }
  });

/////////////Tabs animation and content change in "ОПЕРАЦИИ"
document
  .querySelector('.operations__tab-container')
  .addEventListener('click', function (element) {
    const tabButton = element.target.closest('.operations__tab');
    if (!tabButton) return;

    //Active tab
    tabs.forEach(tab => {
      tab.classList.remove('operations__tab--active');
    });
    tabButton.classList.add('operations__tab--active');

    //Tabs Content
    tabContents.forEach(content => {
      content.classList.remove('operations__content--active');
    });
    document
      .querySelector(`.operations__content--${tabButton.dataset.tab}`)
      .classList.add('operations__content--active');
  });

/////////////highlighting animetion on menu items
const navLinksHoverAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('.nav__logo');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');
    siblingLinks.forEach(el => {
      if (el !== linkOver) el.style.opacity = this;
    });
    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
};
nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));
nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));

/////////////Sticky navigation - Intersection observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const getStickyNav = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const observer = new IntersectionObserver(getStickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});
observer.observe(header);

///////////Sections apear animation - Intersection observer API
const sections = document.querySelectorAll('.section');
const apearSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(apearSection, {
  root: null,
  threshold: 0.2,
});
sections.forEach(element => {
  sectionObserver.observe(element);
  element.classList.add('section--hidden');
});

/////////////Lazy load img - Intersection observer API
const servicesImg = document.querySelectorAll('.services__img');
const lazyLoad = function (entries, observer) {
  const entry = entries[0];
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
  }
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 1,
});
servicesImg.forEach(element => {
  imgObserver.observe(element);
});

/////////////Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const slidesNumber = slides.length;
const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide="${index}"></button>`
    );
  });
};
createDots();

const highlightDot = function (el) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${el}"]`)
    .classList.add('dots__dot--active');
};

const moveToSlide = function (slide) {
  slides.forEach((element, index) => {
    element.style.transform = `translateX(${(index - slide) * 100}%)`;
  });
  highlightDot(currentSlide);
};

const nextSlide = function () {
  if (currentSlide === slides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  highlightDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide < 1) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  highlightDot(currentSlide);
};

moveToSlide(0);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') nextSlide();
  if (event.key === 'ArrowLeft') previousSlide();
});

dotContainer.addEventListener('click', function (element) {
  if (element.target.classList.contains('dots__dot')) {
    const slide = element.target.dataset.slide;
    moveToSlide(slide);
    highlightDot(slide);
  }
});
