document.addEventListener('DOMContentLoaded', function () {
  let langArray = [];
  let options = document.querySelectorAll('.language-picker option');
  options.forEach(function (option) {
    let img = option.getAttribute('data-thumbnail');
    let text = option.innerText;
    let value = option.value;
    let item = '<li><img src="' + img + '" alt="" value="' + value + '"/><span>' + text + '</span></li>';
    langArray.push(item);
  });
  document.querySelector('.language-list').innerHTML = langArray.join('');

  // Set the button value to the first element of the array
  let btnSelect = document.querySelector('.btn-select');
  btnSelect.innerHTML = langArray[0];
  btnSelect.setAttribute('value', options[0].value);

  // Change button stuff on click
  let aListItems = document.querySelectorAll('.language-list li');
  aListItems.forEach(function (item) {
    item.addEventListener('click', function () {
      let img = this.querySelector('img').getAttribute('src');
      let value = this.querySelector('img').getAttribute('value');
      let text = this.innerText;
      let newItem = '<li><img src="' + img + '" alt="" /><span>' + text + '</span></li>';
      btnSelect.innerHTML = newItem;
      btnSelect.setAttribute('value', value);
      document.querySelector('.dropdown-list').style.display = 'none';
    });
  });

  // Toggle dropdown on button click
  btnSelect.addEventListener('click', function () {
    document.querySelector('.dropdown-list').style.display =
      document.querySelector('.dropdown-list').style.display === 'block' ? 'none' : 'block';
  });

  // Check local storage for the lang
  let sessionLang = localStorage.getItem('lang');
  if (sessionLang) {
    let langIndex = langArray.indexOf(sessionLang);
    btnSelect.innerHTML = langArray[langIndex];
    btnSelect.setAttribute('value', sessionLang);
  } else {
    btnSelect.innerHTML = langArray[0];
  }
});
