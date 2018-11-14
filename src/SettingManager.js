import { languages } from './config';

class SettingManager {
  constructor() {
    this.loadSetting();
  }

  loadSetting = () => {
    const unvisibleLanguages = JSON.parse(localStorage.getItem('unvisibleLanguages') || '{}');
    this.visibleLanguages = languages.filter(l => !unvisibleLanguages.hasOwnProperty(l.code));
  };

  getSetting = () => ({
    visibleLanguages: this.visibleLanguages,
  });

  saveSetting = (unvisibleLanguages) => {
    localStorage.setItem('unvisibleLanguages', JSON.stringify(unvisibleLanguages));
    this.loadSetting();
  };
}

export default new SettingManager();
