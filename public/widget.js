document.addEventListener('DOMContentLoaded', () => {
  let firefeedFrame;
  let firefeedButtonOpen;
  const firefeedScript = document.querySelector('script[firefeed-id]');
  const firefeedId = firefeedScript.getAttribute('firefeed-id') || '';
  const [url,] = firefeedScript.src.split('/widget.js') || [''];
  const appUrl = url;

  class FireFeed {
    constructor() {
      this.init();
    }

    async init() {
      try {
        const response = await fetch(`${appUrl}/api/organization/${firefeedId}`);
        const { data: organization } = await response.json();

        const css = document.createElement('link');
        css.href = `${url}/widget.css`;
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.media = 'screen';

        document.head.appendChild(css);
        document.body.insertAdjacentHTML(
          'beforeend',
          `
            <a id='firefeed-button-open' 
               class='firefeed-toggle-feedback firefeed-button-open-${organization?.widgetStyle?.buttonPosition}' 
               style='background: ${organization?.widgetStyle?.buttonBackground}; color: ${organization?.widgetStyle?.buttonColour}'>
               ${organization?.widgetStyle?.buttonText}
            </a>

            <div id='firefeed-frame' class='firefeed-frame-closed' style='display:none;'>
              <iframe allowfullscreen='true' class='firefeed-frame-embed' title='FireFeed' role='dialog' src='${appUrl}/collect/${firefeedId}'></iframe>
            </div>
          `
        );

        this.setupEventListeners();
        firefeedFrame = document.getElementById('firefeed-frame');
        firefeedButtonOpen = document.getElementById('firefeed-button-open');
      } catch (error) {
        console.error('Error initializing FireFeed:', error);
      }
    }

    setupEventListeners() {
      document.addEventListener('click', (event) => {
        const { target } = event;
        const prevent = () => {
          event.preventDefault();
          event.stopPropagation();
        };

        // Event delegation to handle multiple actions on widget buttons
        if (target.matches('.firefeed-toggle-feedback')) {
          this.toggle();
          prevent();
        } else if (target.matches('.firefeed-open-feedback')) {
          this.open();
          prevent();
        } else if (target.matches('.firefeed-close-feedback')) {
          this.close();
          prevent();
        }
      });

      // Listening for messages to toggle widget state (e.g., minimize)
      window.addEventListener('message', (event) => {
        if (event.data === 'firefeed-minimized') {
          this.toggle();
        }
      });
    }

    toggle() {
      firefeedFrame.style.display = 'block';

      const isOpen = firefeedFrame.classList.contains('firefeed-frame-open');
      if (isOpen) {
        firefeedFrame.classList.remove('firefeed-frame-open');
        firefeedFrame.classList.add('firefeed-frame-closed');
        firefeedButtonOpen.style.display = 'inline';
      } else {
        firefeedFrame.classList.remove('firefeed-frame-closed');
        firefeedFrame.classList.add('firefeed-frame-open');
        firefeedButtonOpen.style.display = 'none';
      }
    }
  }

  window.firefeed = new FireFeed();
});
