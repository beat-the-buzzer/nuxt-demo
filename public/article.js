
(function () {
  // 图片懒加载逻辑
  function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]')

    // 浏览器原生支持 IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                img.addEventListener('load', () => {
                  img.classList.add('lazy-loaded')
                })
                observer.unobserve(img)
              }
            }
          })
        },
        {
          rootMargin: '200px 0px',
          threshold: 0.01
        }
      )

      images.forEach((img) => {
        observer.observe(img)
      })
    } else {
      // 降级处理：直接加载所有图片
      images.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute('data-src')
        }
      })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoad)
  } else {
    initLazyLoad()
  }

  // 记录滚动位置的逻辑
  // 监听滚动，记录位置（带节流）
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        localStorage.setItem('scrollPos', window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const savedPos = localStorage.getItem('scrollPos');
    if (savedPos) {
      window.scrollTo({ top: parseInt(savedPos), behavior: 'auto' });
    }
  });


})()
