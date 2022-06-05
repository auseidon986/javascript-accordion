class Accordions {
  constructor(wrapper, opts) {
    
    const defaultOpts = {
      firstItemOpen: true
    };
    
    if (!wrapper) return false;

    this.opts = opts && typeof(opts) == 'object' ? {...defaultOpts, ...opts} : defaultOpts

    this.current = '';

    this.wrapper = wrapper
    this.status = this.wrapper.querySelector('.aus-accordion__status b');
    
    this.accordionGrop = this.wrapper.querySelector('.accordion-items');
    if (!this.accordionGrop) this.accordionGrop = wrapper;

    this.accordions = [...this.accordionGrop.querySelectorAll('.accordion-item')];

    this.init();
  }


  init() {
    this.accordions.forEach(accordion => {
      const btn = accordion.querySelector('.accordion-item__button')
      btn.addEventListener('click', this.handleButtonClick.bind(this))
      accordion.dataset.dataHeight = accordion.querySelector('.accordion-item__text').offsetHeight
      this.toggleAccordion(accordion);
    })
    if (this.accordions.length < 1) return;
    if (this.opts.firstItemOpen) this.toggleAccordion(this.accordions[0], true);
  }

  handleButtonClick(event) {
    event.stopPropagation()
    const accordion = event.target.closest('.accordion-item')
    this.toggleAccordion(accordion)
  }

  toggleAccordion(accordion, makeOpen) {
    if (!accordion) return
    let isOpen = makeOpen && typeof(makeOpen) == 'boolean' ? makeOpen : (accordion.getAttribute('aria-expanded') != 'true')
    accordion.setAttribute('aria-expanded', isOpen ? 'true' : 'false')

    this.onAccordionChanged(accordion)
  }

  onAccordionChanged(accordion) {
    const v = accordion.getAttribute('data-value')
    const isOpen = (accordion.getAttribute('aria-expanded') == 'true')
    if (isOpen) {
      // open accordion
      this.current && this.closeAccordion(this.getCurrentAccordion())
      this.openAccordion(accordion)
      this.current = v
    } else {
      // close accordion
      this.closeAccordion(accordion)
      this.current = ''
    }
    this.updateStatusLabel()
  }

  openAccordion(accordion) {
    accordion.setAttribute('aria-expanded', 'true')
    accordion.querySelector('.accordion-item__text').style.height = accordion.dataset.dataHeight + 'px';
  }

  closeAccordion(accordion) {
    accordion.setAttribute('aria-expanded', 'false')
    accordion.querySelector('.accordion-item__text').style.height = '0px';
  }

  closeAllAccordions() {
    this.accordions.forEach(accordion => {
      this.closeAccordion(accordion);
    })
  }

  getCurrentAccordion() {
    const accordion = this.accordionGrop.querySelector('[data-value="' + this.current + '"]');
    return accordion
  }

  updateStatusLabel() {
    if (this.status) {
      const elm = this.getCurrentAccordion()
      this.status.innerHTML = elm ? elm.querySelector('.accordion-item__button span').innerHTML : 'NONE'
    }
  }
}
