const slideshowContainer = document.querySelector('#slideshow-container');
const slideshow = document.querySelector('#slideshow');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
let currentSlide = 0;
let intervalId;
let progressBar;

prevBtn.addEventListener('click', () => {
  prevSlide();
  progressBar.value = currentSlide;
});

nextBtn.addEventListener('click', () => {
  nextSlide();
  progressBar.value = currentSlide;
});

function fetchProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'products.json', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      data.forEach(product => {
        const slide = document.createElement('div');
        slide.classList.add('slide');

        const img = document.createElement('img');
        img.src = product.src;
        img.alt = product.alt;
        slide.appendChild(img);

        const details = document.createElement('div');
        details.classList.add('details');

        if (product.actionLabel && product.actionURL) {
          const action = document.createElement('button');
          action.classList.add('action');
          action.textContent = product.actionLabel;
          action.addEventListener("click", () => {
            fetch(product.actionURL)
              .then(response => response.json())
              .then(data => {
                const modalContent = document.createElement('div');
                modalContent.classList.add('modal-content');
        
                const modalImg = document.createElement('img');
                modalImg.src = product.src;
                modalImg.alt = product.alt;
                modalContent.appendChild(modalImg);
        
                const modalDetails = document.createElement('div');
                modalDetails.classList.add('modal-details');
        
                const modalTitle = document.createElement('h2');
                modalTitle.textContent = product.title;
                modalDetails.appendChild(modalTitle);
        
                const modalPrice = document.createElement('p');
                modalPrice.classList.add('modal-price');
                modalPrice.textContent = `$${data.price}`;
                modalDetails.appendChild(modalPrice);
        
                const modalDescription = document.createElement('p');
                modalDescription.classList.add('modal-description');
                modalDescription.textContent = data.description;
                modalDetails.appendChild(modalDescription);
    
                modalContent.appendChild(modalDetails);
        
                const modalWrapper = document.createElement('div');
                modalWrapper.classList.add('modal');
                modalWrapper.appendChild(modalContent);
                document.body.appendChild(modalWrapper);
                modalWrapper.classList.add('active');

                console.log("Modal Created.");
        
                const modalCloseBtn = document.createElement('button');
                modalCloseBtn.classList.add('modalClose');
                modalCloseBtn.textContent = 'Close Modal';
                modalCloseBtn.addEventListener("click", () => {
                  modalWrapper.remove();
                  modalContent.remove();
                })
                modalContent.appendChild(modalCloseBtn);
              })
              .catch(error => console.error(error));
          });
    
          details.appendChild(action);
        }
        slide.appendChild(details);
        slideshow.appendChild(slide);
      });

      progressBar = document.createElement('progress');
      progressBar.classList.add('progress-bar');
      progressBar.setAttribute('value', '0');
      progressBar.setAttribute('max', slideshow.children.length - 1);
      slideshowContainer.appendChild(progressBar);
      
      slideshow.firstElementChild.classList.add('active');
      intervalId = setInterval(nextSlide, 1000);
    } 
    else {
      console.error(xhr.statusText);
    }
  };
  xhr.onerror = function() {
    console.error(xhr.statusText);
  };
  xhr.send();
}

function nextSlide() {
  slideshow.children[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slideshow.children.length;
  slideshow.children[currentSlide].classList.add('active');
  progressBar.value = currentSlide;
}

function prevSlide() {
  slideshow.children[currentSlide].classList.remove('active');
  currentSlide = (currentSlide - 1 + slideshow.children.length) % slideshow.children.length;
  slideshow.children[currentSlide].classList.add('active');
  progressBar.value = currentSlide;
}

fetchProducts();
