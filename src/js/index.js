import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';

import '../css/style.css';
import { fetchImages } from './fetchImages';
import { scroll } from './scroll';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;

const galleryLightBox = new SimpleLightbox('.lightbox-image');
// Створюємо асинхронну функцію для отримання даних зображень з сервера

const displayImages = data => {
  let images = '';
  data.hits.forEach(image => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = image;
      images += `
    <a href="${largeImageURL}" class="lightbox-image" target="_self">
        <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width="360" height="270"/>
            <div class="info">
                <p class="info-item"><b>Likes</b>: ${likes}</p>
                <p class="info-item"><b>Views</b>: ${views}</p>
                <p class="info-item"><b>Comments</b>: ${comments}</p>
                <p class="info-item"><b>Downloads</b>: ${downloads}</p>
            </div>
        </div>
    </a>`;
  });

  gallery.insertAdjacentHTML('beforeend', images);
  galleryLightBox.refresh();
  scroll();
  if (data.hits.length < 40) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMoreBtn.style.display = 'block';
  }
};

galleryLightBox.refresh();
form.addEventListener('submit', async evt => {
  evt.preventDefault();
  searchQuery = evt.target.searchQuery.value.trim();
  page = 1;
  loadMoreBtn.style.display = 'none';
  if (!searchQuery) {
    return;
  }
  const data = await fetchImages();
  gallery.innerHTML = '';
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    displayImages(data);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
});
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  const data = await fetchImages();
  if (!data) return;
  displayImages(data);
});

galleryLightBox.refresh();

export { page, searchQuery, gallery };
