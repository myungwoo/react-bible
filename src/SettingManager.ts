import { Language, languages } from "./config";

export interface Setting {
  visibleLanguages: Language[];
}

let visibleLanguages: Language[] = [];

export const loadSetting = () => {
  const unvisibleLanguages = JSON.parse(
    localStorage.getItem("unvisibleLanguages") || "{}"
  );
  visibleLanguages = languages.filter(
    (l) => !Object.prototype.hasOwnProperty.call(unvisibleLanguages, l.code)
  );
};

export const getSetting = (): Setting => ({
  visibleLanguages,
});

export const saveSetting = (unvisibleLanguages: { [key: string]: boolean }) => {
  localStorage.setItem(
    "unvisibleLanguages",
    JSON.stringify(unvisibleLanguages)
  );
  loadSetting();
};

loadSetting();
