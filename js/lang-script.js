let lang = localStorage.getItem('lang') ?? 'en';

document.getElementById('language').value = lang;

document.getElementById('language').addEventListener('change', function (e) {
  e.preventDefault();

  let newLang = this.value;
  if (newLang !== lang) {
    lang = newLang;
    changeUrlLanguage(newLang);
  }
});

function changeUrlLanguage(newLang) {
  localStorage.setItem('lang', newLang);
  window.location.search = `?lang=${newLang}`;
}

function changeLanguage() {
  for (let key in langData) {
    document.querySelector(`.lng-${key}`).innerHTML = langData[key][lang];
  }
}
document.addEventListener('DOMContentLoaded', function () {
  changeLanguage();
});
