import { gallery } from './index';

function scroll() {
  if (!gallery.firstElementChild) {
    return;
  } else {
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    if (window.pageYOffset >= cardHeight * 2) {
      window.scrollBy({
        top: (cardHeight - 18) * 2,
        behavior: 'smooth',
      });
    }
  }
}

export { scroll };
