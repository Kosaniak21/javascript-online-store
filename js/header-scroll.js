// const navbar = document.querySelector('.navbar');
// const discountInfo = document.querySelector('.discount-info');

// // Отримати висоту хедера та блоку знижки
// const navbarHeight = navbar.offsetHeight;
// const discountInfoHeight = discountInfo.offsetHeight;
// const totalHeaderHeight = navbarHeight + discountInfoHeight;

// // Зберегти відстань від верху сторінки до хедера
// const navbarTop = navbar.offsetTop;
// function toggleFixedNavbar() {
//   // Отримати відстань, на яку прокручена сторінка
//   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//   // Перевірити, чи прокручено більше, ніж висота блоку знижки
//   if (scrollTop > discountInfoHeight) {
//     // Зафіксувати хедер
//     navbar.classList.add('fixed-navbar');
//     //  // Змінити margin-top у контенті, щоб уникнути перекриття
//     document.body.style.marginTop = totalHeaderHeight + 'px';
//   } else {
//     // Відкріпити хедер
//     navbar.classList.remove('fixed-navbar');
//     // Повернути стандартний margin-top для контенту
//     document.body.style.marginTop = '0';
//   }
// }
// window.addEventListener('scroll', toggleFixedNavbar);
