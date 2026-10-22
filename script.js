(() => {
  'use strict';

  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const poster = document.querySelector('.poster');
  const progress = document.querySelector('.scroll-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* Scroll progress and subtle hero parallax share one animation frame. */
  let scrollFrame = 0;

  const updateScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    const heroHeight = hero ? hero.offsetHeight : 1;
    const heroProgress = Math.min(1, Math.max(0, y / heroHeight));
    const scrollRange = Math.max(1, root.scrollHeight - window.innerHeight);
    const pageProgress = Math.min(1, Math.max(0, y / scrollRange));

    if (hero && !reducedMotion.matches) {
      hero.style.setProperty('--hero-progress', heroProgress.toFixed(4));
    }

    if (progress) {
      progress.style.transform = `scaleY(${pageProgress.toFixed(4)})`;
    }

    scrollFrame = 0;
  };

  const requestScrollUpdate = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  updateScroll();

  /* Reveal content only when it enters the reading flow. */
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* Fine-pointer depth: intentionally tiny so the illustration stays sharp. */
  if (poster && precisePointer.matches && !reducedMotion.matches) {
    let pointerFrame = 0;
    let pointerEvent;

    const renderPointer = () => {
      if (!pointerEvent) return;
      const bounds = poster.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (pointerEvent.clientX - bounds.left) / bounds.width));
      const y = Math.min(1, Math.max(0, (pointerEvent.clientY - bounds.top) / bounds.height));

      poster.style.setProperty('--tilt-x', `${((0.5 - y) * 0.85).toFixed(3)}deg`);
      poster.style.setProperty('--tilt-y', `${((x - 0.5) * 1.05).toFixed(3)}deg`);
      poster.style.setProperty('--pointer-scale', '1.004');
      poster.style.setProperty('--light-x', `${(x * 100).toFixed(2)}%`);
      poster.style.setProperty('--light-y', `${(y * 100).toFixed(2)}%`);
      pointerFrame = 0;
    };

    poster.addEventListener('pointerenter', () => poster.classList.add('is-tracking'));
    poster.addEventListener('pointermove', (event) => {
      pointerEvent = event;
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(renderPointer);
    });

    poster.addEventListener('pointerleave', () => {
      poster.classList.remove('is-tracking');
      poster.style.setProperty('--tilt-x', '0deg');
      poster.style.setProperty('--tilt-y', '0deg');
      poster.style.setProperty('--pointer-scale', '1');
      pointerEvent = null;
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
    });
  }

  /* Native dialog keeps the poster's embedded stories keyboard accessible. */
  const stories = {
    perspective: {
      eyebrow: 'A NEW PERSPECTIVE / 01',
      title: 'See a bigger world',
      quote: '“Football makes me see a bigger world. A new perspective changes everything.”',
      image: 'assets/isagi-perspective.webp',
      alt: 'Manga collage of Isagi on the field and a close-up of his blue eye.',
      position: '50% 50%'
    },
    vision: {
      eyebrow: 'METAVISION / 02',
      title: 'Vision. Adaptation. Evolution.',
      quote: '“Football isn’t just a game. It’s a place where I can become a better me.”',
      image: 'assets/isagi-vision.webp',
      alt: 'Detailed manga close-ups of Isagi Yoichi’s electric-blue eyes.',
      position: '50% 45%'
    },
    greater: {
      eyebrow: 'SAME PASSION. BIGGER MEANING. / 03',
      title: 'A greater view',
      quote: '“I want to see a greater view. It’s not just a game—it’s my way to a better self.”',
      image: 'assets/isagi-action.webp',
      alt: 'Dynamic monochrome manga panel of Isagi Yoichi in action.',
      position: '55% 50%'
    }
  };

  const dialog = document.querySelector('#story-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const dialogEyebrow = document.querySelector('#dialog-eyebrow');
  const dialogTitle = document.querySelector('#dialog-title');
  const dialogQuote = document.querySelector('#dialog-quote');
  const dialogClose = document.querySelector('.story-dialog__close');
  let activeTrigger = null;

  const closeDialog = () => {
    if (dialog?.open) dialog.close();
  };

  document.querySelectorAll('[data-story]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const story = stories[trigger.dataset.story];
      if (!story || !dialog) return;

      activeTrigger = trigger;
      dialogEyebrow.textContent = story.eyebrow;
      dialogTitle.textContent = story.title;
      dialogQuote.textContent = story.quote;
      dialogImage.src = story.image;
      dialogImage.alt = story.alt;
      dialogImage.style.objectPosition = story.position;
      document.body.classList.add('dialog-open');
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });

  dialogClose?.addEventListener('click', closeDialog);

  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const isOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (isOutside) closeDialog();
  });

  dialog?.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    activeTrigger?.focus({ preventScroll: true });
    activeTrigger = null;
  });

  reducedMotion.addEventListener?.('change', () => {
    if (!reducedMotion.matches) return;
    hero?.style.setProperty('--hero-progress', '0');
    revealItems.forEach((item) => item.classList.add('is-visible'));
  });
})();
