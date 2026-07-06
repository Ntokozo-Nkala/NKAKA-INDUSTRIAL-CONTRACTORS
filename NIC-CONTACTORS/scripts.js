// Before/after slider
const slider = document.getElementById('slider');
const afterWrapper = document.getElementById('afterWrapper');
if(slider && afterWrapper){
slider.addEventListener('input', () => {
afterWrapper.style.width = slider.value + '%';
});
}

// Fade-in service cards on scroll
const observer = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
if(entry.isIntersecting){
entry.target.classList.add('show');
}
});
});
document.querySelectorAll('.service-card').forEach((card) => {
observer.observe(card);
});

// Testimonial slider with dots
const testimonials = document.querySelectorAll('.testimonial');
const dotsContainer = document.getElementById('testimonialDots');
let currentSlide = 0;
let testimonialTimer = null;

function goToSlide(index){
if(testimonials.length === 0) return;
testimonials[currentSlide].classList.remove('active-slide');
const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
if(dots[currentSlide]) dots[currentSlide].classList.remove('active');
currentSlide = index;
testimonials[currentSlide].classList.add('active-slide');
if(dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function startTestimonialTimer(){
if(testimonialTimer) clearInterval(testimonialTimer);
testimonialTimer = setInterval(() => {
const next = (currentSlide + 1) % testimonials.length;
goToSlide(next);
}, 4000);
}

if(testimonials.length > 0){
testimonials[currentSlide].classList.add('active-slide');

if(dotsContainer){
testimonials.forEach((_, i) => {
const dot = document.createElement('button');
dot.className = 'dot' + (i === 0 ? ' active' : '');
dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
dot.addEventListener('click', () => {
goToSlide(i);
startTestimonialTimer();
});
dotsContainer.appendChild(dot);
});
}

startTestimonialTimer();
}

// Scroll-to-top button
const scrollTopBtn = document.getElementById('scrollTop');
if(scrollTopBtn){
window.addEventListener('scroll', () => {
if(window.scrollY > 400){
scrollTopBtn.classList.add('show-scroll');
}
else{
scrollTopBtn.classList.remove('show-scroll');
}
});
scrollTopBtn.addEventListener('click', () => {
window.scrollTo({
top:0,
behavior:'smooth'
});
});
}

// Sticky navbar background
const navbar = document.querySelector('.navbar');
if(navbar){
window.addEventListener('scroll', () => {
if(window.scrollY > 50){
navbar.classList.add('scrolled');
} else {
navbar.classList.remove('scrolled');
}
});
}

// Portfolio filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');
filterBtns.forEach((btn) => {
btn.addEventListener('click', () => {
filterBtns.forEach((b) => b.classList.remove('active'));
btn.classList.add('active');
const filter = btn.dataset.filter;
portfolioCards.forEach((card) => {
if(filter === 'all' || card.dataset.category === filter){
card.classList.remove('hidden');
} else {
card.classList.add('hidden');
}
});
});
});

// Service cards link into portfolio filter
document.querySelectorAll('.service-card[data-filter-target]').forEach((card) => {
card.addEventListener('click', (e) => {
const target = card.dataset.filterTarget;
const matchingBtn = document.querySelector('.filter-btn[data-filter="' + target + '"]');
if(matchingBtn){
setTimeout(() => matchingBtn.click(), 300);
}
});
});

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

function closeMobileMenu(){
hamburger.classList.remove('open');
mobileMenu.classList.remove('open');
if(menuOverlay) menuOverlay.classList.remove('open');
hamburger.setAttribute('aria-expanded', 'false');
document.body.style.overflow = '';
}

function openMobileMenu(){
hamburger.classList.add('open');
mobileMenu.classList.add('open');
if(menuOverlay) menuOverlay.classList.add('open');
hamburger.setAttribute('aria-expanded', 'true');
document.body.style.overflow = 'hidden';
}

if(hamburger && mobileMenu){
hamburger.addEventListener('click', () => {
const isOpen = hamburger.classList.contains('open');
if(isOpen){
closeMobileMenu();
} else {
openMobileMenu();
}
});

mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-quote-btn').forEach((link) => {
link.addEventListener('click', closeMobileMenu);
});

if(menuOverlay){
menuOverlay.addEventListener('click', closeMobileMenu);
}

window.addEventListener('keydown', (e) => {
if(e.key === 'Escape' && hamburger.classList.contains('open')){
closeMobileMenu();
}
});
}

// Contact form validation
const contactForm = document.getElementById('contactForm');
if(contactForm){
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const subjectInput = document.getElementById('subjectInput');
const messageInput = document.getElementById('messageInput');
const formStatus = document.getElementById('formStatus');

const fields = [
{ input: nameInput, errorId: 'nameError', validate: (v) => v.trim().length >= 2, message: 'Please enter your name.' },
{ input: emailInput, errorId: 'emailError', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: 'Please enter a valid email address.' },
{ input: subjectInput, errorId: 'subjectError', validate: (v) => v.trim().length >= 2, message: 'Please enter a subject.' },
{ input: messageInput, errorId: 'messageError', validate: (v) => v.trim().length >= 10, message: 'Message should be at least 10 characters.' }
];

function validateField(field){
const errorEl = document.getElementById(field.errorId);
const valid = field.validate(field.input.value);
if(valid){
field.input.classList.remove('invalid');
if(errorEl) errorEl.textContent = '';
} else {
field.input.classList.add('invalid');
if(errorEl) errorEl.textContent = field.message;
}
return valid;
}

fields.forEach((field) => {
field.input.addEventListener('blur', () => validateField(field));
field.input.addEventListener('input', () => {
if(field.input.classList.contains('invalid')) validateField(field);
});
});

contactForm.addEventListener('submit', (e) => {
e.preventDefault();
const allValid = fields.map(validateField).every(Boolean);

if(!allValid){
if(formStatus){
formStatus.textContent = 'Please fix the errors above.';
formStatus.className = 'form-status error';
}
return;
}

const submitBtn = contactForm.querySelector('button[type="submit"]');
if(submitBtn){
submitBtn.disabled = true;
submitBtn.textContent = 'Sending...';
}

const subject = encodeURIComponent(subjectInput.value.trim());
const body = encodeURIComponent(
'Name: ' + nameInput.value.trim() + '\n' +
'Email: ' + emailInput.value.trim() + '\n\n' +
messageInput.value.trim()
);

window.location.href = 'mailto:info@isdwabasuc.co.za?subject=' + subject + '&body=' + body;

if(formStatus){
formStatus.textContent = 'Opening your email client to send this message...';
formStatus.className = 'form-status success';
}

if(submitBtn){
setTimeout(() => {
submitBtn.disabled = false;
submitBtn.textContent = 'Send Message';
}, 2000);
}
});
}