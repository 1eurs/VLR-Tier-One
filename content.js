// Check if an element is Tier 1 (VCT, Masters, Champions)
function isTier1(element, type) {
  const tier1Keywords = ['Champions Tour', 'VCT', 'Masters', 'Champions'];
  const tier1Classes = ['mod-bg-after-red', 'mod-bg-after-striped_purple', 'mod-bg-after-striped_redyellow'];

  if (type === 'match') {
    const event = element.querySelector('.hz-match-event, .h-match-preview-event')?.textContent || '';
    return tier1Keywords.some(keyword => event.includes(keyword)) || tier1Classes.some(cls => element.classList.contains(cls));
  } else if (type === 'news') {
    const title = element.querySelector('.news-item-title')?.textContent || '';
    return tier1Keywords.some(keyword => title.includes(keyword));
  } else if (type === 'event') {
    const name = element.querySelector('.event-item-name')?.textContent || '';
    return tier1Keywords.some(keyword => name.includes(keyword)) || tier1Classes.some(cls => element.classList.contains(cls));
  } else if (type === 'thread') {
    const title = element.querySelector('.module-item-title')?.textContent || '';
    return tier1Keywords.some(keyword => title.includes(keyword));
  }
  return false;
}

// Hide non-Tier 1 content and collapse empty sections
function filterTier1Content() {
  // Matches
  document.querySelectorAll('.hz-match, .wf-module-item.mod-match').forEach(item => {
    if (!isTier1(item, 'match')) {
      item.style.display = 'none';
    }
  });

  // News
  document.querySelectorAll('.wf-module-item.news-item').forEach(item => {
    if (!isTier1(item, 'news')) {
      item.style.display = 'none';
    }
  });

  // Events
  document.querySelectorAll('.wf-module-item.event-item').forEach(item => {
    if (!isTier1(item, 'event')) {
      item.style.display = 'none';
    }
  });

  // Threads
  document.querySelectorAll('.wf-module-item.mod-disc').forEach(item => {
    if (!isTier1(item, 'thread')) {
      item.style.display = 'none';
    }
  });

  // Collapse empty sections (matches, events, threads)
  document.querySelectorAll('.wf-module.wf-card, .h-box, .wf-module.wf-card.mod-sidebar').forEach(section => {
    const items = section.querySelectorAll('.wf-module-item, .hz-match');
    const visibleItems = Array.from(items).filter(item => item.style.display !== 'none').length;
    if (visibleItems === 0) {
      section.style.display = 'none';
      const label = section.previousElementSibling?.classList.contains('wf-label') ? section.previousElementSibling : null;
      if (label) {
        label.style.display = 'none';
      }
    }
  });

  // Collapse empty news sections and their date labels
  document.querySelectorAll('.js-home-news .wf-label').forEach(label => {
    const nextCard = label.nextElementSibling?.classList.contains('wf-card') ? label.nextElementSibling : null;
    if (nextCard) {
      const visibleItems = nextCard.querySelectorAll('.wf-module-item:not([style*="display: none"])').length;
      if (visibleItems === 0) {
        label.style.display = 'none';
        nextCard.style.display = 'none';
      }
    }
  });
}

// Show all content
function resetFilter() {
  document.querySelectorAll('.hz-match, .wf-module-item, .wf-module.wf-card, .h-box, .wf-label').forEach(item => {
    item.style.display = '';
  });
}

// Add a toggle button
function addToggleButton() {
  const header = document.querySelector('.header-inner');
  if (!header) return;

  const button = document.createElement('div');
  button.className = 'header-switch tier1-toggle mod-active';
  button.innerHTML = `
    <div style="text-align: center;">
      <div style="margin-bottom: 4px;">Tier 1 Only:</div>
      <span class="on">ON</span>
      <span class="off">OFF</span>
    </div>
  `;
  header.appendChild(button);

  button.addEventListener('click', () => {
    button.classList.toggle('mod-active');
    if (button.classList.contains('mod-active')) {
      filterTier1Content();
    } else {
      resetFilter();
    }
  });
}

// Run when the page loads
addToggleButton();
filterTier1Content();
