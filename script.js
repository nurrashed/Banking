'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

/* for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal); */

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//=====Implemting smooth scrolling=====
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//=====Page navigation=====
//The bellow solution has a problem. If we have 1000 seelctor and all of them have the same function then for sure
//performance will be degraded.
/* document.querySelectorAll('.nav__link').forEach(function(e){
  e.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href')
    //console.log(id);
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  })
}) */

//Event deligation is the solution to the last problem
//Event deligation:- JavaScript event delegation is a simple technique by which you add a single event handler
//to a parent element in order to avoid having to add event handlers to multiple child elements.
//1. addEventListen er to a common parent element
//2. And then in that eventListener determine in what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//========================Operations Tab=====================================

//Event deligation
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  /* The closest() method traverses the Element and its parents (heading toward the document root) until it 
  finds a node that matches the provided selector string. Will return itself or the matching ancestor. 
  If no such element exists, it returns null. */
  //console.log(testClicked);
  //console.log(clicked);
  //if we clicked anywhere outside the tab button then it returns null becase closest method do not find parentelement
  // with an attribute 'operations__tab'. To prevent this we need to do this. It is knows ans Guard Clauses.
  if (!clicked) return; // If we press clcik outside the tab button then click will be null, and null is a faulsy value.
  // "!clicked" = "!false" = "true" then return and do not execte anycode after that.

  //Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  //Activate content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//===========================Menu / Tab fade animation======================================

const handelHover = function (e, opacity) {
  //console.log(this);
  //console.log(e);
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    //console.log(siblings);
    //console.log(link);
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  handelHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handelHover(e, 1);
});

//Or
// in that case we need to remove 'opacity' from the function declaration (line 105) and instead of opacity need to write 'this'
/* nav.addEventListener('mouseover', handelHover.bind(0.5)); // Bind returns function. In addEventlistener we cannot use a value
// like handelHover(0.5). We must use bind. Bind returns a function. 

nav.addEventListener('mouseout', handelHover.bind(1)); */

//=========================Sticky navigation===========================

//==Intersection Observer API==
//Why it is so helpful? well this API allows our code to observe changes to the way that a cirtain target element
//intersect another element or the way it intersect the view port.

/* const obsCallback = function(entries, observer){
  entries.forEach(entry => console.log(entry));
}

const obsOptions = {
  root: null,
  threshold: 0.1, 
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); */

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  theshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//====================================Reveal sections using Intersection Observer API=======================================
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

//=====================================Lazy loading images===================================

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImage = (entries, observer) => {
  const [entry] = entries;
  console.log(entry);

  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
  } else return;
  observer.unobserve(entry.target);

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

//============================================Slider=======================================

const slider = function (){
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const maxSlide = slides.length;

//Function
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide = "${i}">
    </button>`
    );
  });
};


const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
    console.log('active slide');
};


const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};


//Next Slide
const nextSlide = function () {
  //e.preventDefault();
  currentSlide === maxSlide - 1 ? (currentSlide = 0) : currentSlide++;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

//Previous Slide
const prevSlide = function () {
  //e.preventDefault();
  currentSlide === 0 ? (currentSlide = maxSlide - 1) : currentSlide--;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
}
init();

//Event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  //console.log(e);
  if (e.key === 'ArrowLeft') prevSlide(e);
  if (e.key === 'ArrowRight') nextSlide(e);
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
};
slider();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Creating and inserting elements
// insertAdjacentHTML

/* const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies <button class="btn btn--close-cookie">Got it</button>';
header.prepend(message); */
//header.before(message);
//header.after(message.cloneNode('true')); // Special rules to make several copy of a same element in DOM.
// Because in DOM one element can stay in one place. not in multiple places.

//Delete element

/* document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove()); */

//=========================Style, attributes and classes(184)=============================

//====Styles======
//==Inline Style==

/* message.style.backgroundColor = '#121212';
message.style.width = '120%'

console.log(message.style.backgroundColor); // .style works only for inline css structure. 

console.log(message.style.color); // don't return anythings as color is not defined in inline css 
//but there is a solution to it
console.log(getComputedStyle(message).color);

console.log(getComputedStyle(message).height);
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';
console.log(message.style.height); */

//==CSS variables in css file===
//WE can change value in css file right from js file

//.documentElement is the whole HTML element
//document.documentElement.style.setProperty('--color-primary', 'orangered')

//==Attributes==
// In js we can get access and change attributes value in HTML

//Read attributes
/* const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className); */

//Write ot chnage attributes value in HTML

/* logo.alt = 'test';
console.log(logo.alt); */

//getAttributes

/* console.log(logo.src); // absolute version
console.log(logo.getAttribute('src')); // Relative version

const link = document.querySelector('.footer__link');
console.log(link.href);
console.log(link.getAttribute('href')); */

//Data attributes ---- it is a special type of attributes
//This attributes start with 'data' in HTML
/* console.log(logo.dataset.versionNumber);
console.log(logo.getAttribute('data-version-number')); */

//=====Classes=====
/* logo.classList.add('a', 'b', 'c', 'd', 'e');
logo.classList.remove('b');
logo.classList.toggle('a','e'); */
//logo.classList.contains();

//====================================Types of event and event handler======================
//========Mouse enter event==========

/* const h1 = document.querySelector('h1');

//mouseenter is like hovering over in an element
const alerth1 = ()=>{
  alert('addEventListener: Great ')
};
h1.addEventListener('mouseenter', alerth1)
setTimeout(()=>h1.removeEventListener('mouseenter', alerth1), 3000); */

//====Bubbling========

//random color genrator
/* const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

  console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav__links').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener('click', function(e) {
  console.log('Link');
}); */

//=======DOM traversing=================

//const h1 = document.querySelector('h1');
//Going downwards: child
/* console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); //.Children only works in direct children
h1.firstElementChild.style.color = 'red';
h1.lastElementChild.style.color = 'red'; */

//Going upwords: parent
/* console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
 */

//Going sideways:Siblings

/* console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
 */
//all children
//console.log(h1.parentElement.children);
