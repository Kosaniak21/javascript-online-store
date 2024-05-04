function generateNumberOrder(length = 4) {
  const randomNumber = Math.floor(Math.random() * (Math.pow(10, length - 1) * 9)) + Math.pow(10, length - 1);

  return randomNumber + '#';
}

function dateForOrder() {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();

  return `${day}.${month}.${year}`;
}
