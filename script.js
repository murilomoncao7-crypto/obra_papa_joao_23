const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  const icon = menuToggle.querySelector('i');

  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');

    const icon = menuToggle.querySelector('i');

    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
  });
});