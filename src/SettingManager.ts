import { languages, Language } from './config';

export interface Setting{
  visibleLanguages: Language[];
}

class SettingManager {
  visibleLanguages: Language[];
  constructor() {
    this.visibleLanguages = [];
    this.loadSetting();
  }

  loadSetting = () => {
    const unvisibleLanguages = JSON.parse(localStorage.getItem('unvisibleLanguages') || '{}');
    this.visibleLanguages = languages.filter(l => !unvisibleLanguages.hasOwnProperty(l.code));
  };

  getSetting = (): Setting => ({
    visibleLanguages: this.visibleLanguages,
  });

  saveSetting = (unvisibleLanguages: {[key: string]: boolean}) => {
    localStorage.setItem('unvisibleLanguages', JSON.stringify(unvisibleLanguages));
    this.loadSetting();
  };
}

export default new SettingManager();
