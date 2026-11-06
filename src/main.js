import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

const form = document.querySelector('.form');

const loadMoreBtn = document.querySelector('.load-more');


function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;


async function loadMoreImages() {
    hideLoadMoreButton();
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    createGallery(data.hits);

    
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length > 0) {
  const cardHeight = galleryItems[0].getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

    

if (currentPage * 15 < totalHits) {
  showLoadMoreButton();
} else {
  hideLoadMoreButton();

  iziToast.info({
    message: "We're sorry, but you've reached the end of search results.",
    position: 'topRight',
  });
}


  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later!',
      position: 'topRight',
    });
    console.error(error);
    currentPage -= 1;
    showLoadMoreButton();
  } finally {
    hideLoader();
  }
}

loadMoreBtn.addEventListener('click', loadMoreImages);


form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = event.currentTarget.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  
currentQuery = query;
currentPage = 1;
totalHits = 0;
loadMoreBtn.classList.add('is-hidden');


  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(query);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    
totalHits = data.totalHits;

if (currentPage * 15 < totalHits) {
  loadMoreBtn.classList.remove('is-hidden');
}

  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later!',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
  }
});