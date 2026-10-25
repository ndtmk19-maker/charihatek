/**
 * Application View Navigation Controller
 * Handles tabs switching between Editor, Live Deck Preview, and Design Settings.
 */

export class AppRouter {
  constructor(state) {
    this.state = state;
    this.bindTabButtons();
  }

  bindTabButtons() {
    const navButtons = document.querySelectorAll('[data-view-target]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.getAttribute('data-view-target');
        this.navigateTo(targetView);
      });
    });
  }

  navigateTo(viewName) {
    this.state.setView(viewName);
    this.renderCurrentView();
  }

  renderCurrentView() {
    const viewName = this.state.activeView;

    // Update nav button active states
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      if (btn.getAttribute('data-view-target') === viewName) {
        btn.classList.add('nav-tab-active');
      } else {
        btn.classList.remove('nav-tab-active');
      }
    });

    // Update view panels visibility
    document.querySelectorAll('.app-view-panel').forEach(panel => {
      if (panel.id === `view-${viewName}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
