import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "plcnext-header-init",

  initialize() {
    withPluginApi("0.11.1", (api) => {
      api.onPageChange(() => {
        // Initialize PLCNext header functionality
        setTimeout(() => {
          initializePLCNextHeader();
        }, 100);
      });
    });

    // Also initialize immediately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializePLCNextHeader);
    } else {
      initializePLCNextHeader();
    }
  }
};

function initializePLCNextHeader() {
  const menuWrapper = document.querySelector('[data-menu-wrapper]');
  if (!menuWrapper) return;

  // Elements
  const searchToggle = menuWrapper.querySelector('[data-search-toggle]');
  const searchOverlay = menuWrapper.querySelector('[data-search-overlay]');
  const searchClose = menuWrapper.querySelector('[data-search-close]');
  const mobileMenuToggle = menuWrapper.querySelector('[data-burger]');
  const mobileOverlay = menuWrapper.querySelector('[data-mobile-nav]');
  const submenuItems = menuWrapper.querySelectorAll('[data-submenu]');

  // Search functionality
  if (searchToggle && searchOverlay) {
    // Remove existing listeners first
    const newSearchToggle = searchToggle.cloneNode(true);
    searchToggle.parentNode.replaceChild(newSearchToggle, searchToggle);

    newSearchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      searchOverlay.classList.toggle('active');

      if (searchOverlay.classList.contains('active')) {
        const searchInput = searchOverlay.querySelector('.search-input');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    });

    if (searchClose) {
      const newSearchClose = searchClose.cloneNode(true);
      searchClose.parentNode.replaceChild(newSearchClose, searchClose);

      newSearchClose.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.remove('active');
      });
    }

    // Handle search input
    const searchInput = searchOverlay.querySelector('.search-input');
    if (searchInput) {
      const newSearchInput = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(newSearchInput, searchInput);

      newSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = this.value.trim();
          if (query) {
            window.location.href = '/search?q=' + encodeURIComponent(query);
          }
        }

        if (e.key === 'Escape') {
          searchOverlay.classList.remove('active');
        }
      });
    }
  }

  // Mobile menu functionality
  if (mobileMenuToggle && mobileOverlay) {
    const newMobileToggle = mobileMenuToggle.cloneNode(true);
    mobileMenuToggle.parentNode.replaceChild(newMobileToggle, mobileMenuToggle);

    newMobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const isActive = mobileOverlay.classList.contains('active');

      if (isActive) {
        mobileOverlay.classList.remove('active');
        newMobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        mobileOverlay.classList.add('active');
        newMobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close mobile menu on overlay click
    mobileOverlay.addEventListener('click', function(e) {
      if (e.target === mobileOverlay) {
        mobileOverlay.classList.remove('active');
        newMobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Submenu hover functionality (desktop only)
  submenuItems.forEach(function(item) {
    const submenuOverlay = item.querySelector('[data-overlay]');
    if (!submenuOverlay) return;

    let hoverTimeout;

    item.addEventListener('mouseenter', function() {
      if (window.innerWidth > 1023) {
        clearTimeout(hoverTimeout);
        submenuOverlay.style.opacity = '1';
        submenuOverlay.style.visibility = 'visible';
        submenuOverlay.style.transform = 'translateX(-50%) translateY(0)';
      }
    });

    item.addEventListener('mouseleave', function() {
      if (window.innerWidth > 1023) {
        hoverTimeout = setTimeout(function() {
          submenuOverlay.style.opacity = '0';
          submenuOverlay.style.visibility = 'hidden';
          submenuOverlay.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 150);
      }
    });
  });

  console.log('PLCNext Community Header initialized successfully');
}