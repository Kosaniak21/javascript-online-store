class Cart {
  constructor() {
    this.cartContainer = document.querySelector('#modal-cart');
    this.cart = JSON.parse(localStorage['cart'] || '{}');
    this.totalContainer = document.querySelector('#total');
    this.addEventListeners();
    this.updateBadge();
    this.productService = new ProductsService();
  }
  addEventListeners() {
    document.querySelectorAll('.openCartLink').forEach(link => {
      link.addEventListener('click', () => this.renderCart());
    });
    this.cartContainer.querySelector('.order').addEventListener('click', ev => this.order(ev));
  }
  saveCart() {
    localStorage['cart'] = JSON.stringify(this.cart);
  }
  async renderCart() {
    let total = 0;
    let cartDomSting = `<div class="container">
                <div class="row modal-titles">
                    <div class="col-6 modal-product-title lng-modal-product">Products</div>
                    <div class="col-3 d-flex justify-content-end modal-quantity-title lng-modal-quantity"></div>
                    <div class="col-3 d-flex justify-content-end lng-modal-price"></div>
                </div>`;
    for (const item in this.cart) {
      const { product, image } = await this.productService.getProductById(item);
      const quantity = this.cart[item];
      total += product.price * this.cart[item];
      cartDomSting += `<div class="row cart-buttons" data-id="${product.id}">
      <div class="col-6 mb-3"><img class="cart-image" src="img/products/${image}" alt="${product.title}"> ${product.title}</div>
      <div class="col-3 d-flex justify-content-end align-items-center">
          <button data-item=${item} class="btn btn-sm plus">+</button>
         <span class="quantity">${quantity}</span>
          <button data-item=${item} class="btn btn-sm minus">-</button>
      </div>
      <div class="col-3 d-flex justify-content-end align-items-center cart-price lng-modal-price">${product.price}</div>
  </div>`;
    }
    total = total.toFixed(2);

    this.cartContainer.querySelector('.cart-product-list-container').innerHTML = cartDomSting;

    this.totalContainer.innerHTML = `<strong class="total-price">$${total}</strong>`;

    this.cartContainer.querySelectorAll('.plus').forEach(el =>
      el.addEventListener('click', ev => {
        const { id, image } = JSON.parse(ev.target.dataset.item);
        this.addProduct(id, image);
      }),
    );

    this.cartContainer
      .querySelectorAll('.minus')
      .forEach(el => el.addEventListener('click', ev => this.changeQuantity(ev, this.deleteProduct)));

    changeLanguage();
  }

  changeQuantity(ev, operation) {
    const button = ev.target;
    const item = button.dataset.item;
    operation.call(this, item);
    this.renderCart();
  }

  addProduct(id, image) {
    const productKey = JSON.stringify({ id, image });
    this.cart[productKey] = (this.cart[productKey] || 0) + 1;
    this.saveCart();
    this.updateBadge();
    this.renderCart();
  }

  deleteProduct(item) {
    if (this.cart[item] > 1) {
      this.cart[item] -= 1;
    } else {
      delete this.cart[item];
    }
    this.saveCart();
    this.updateBadge();
  }

  updateBadge() {
    document.querySelector('#cart-badge').innerText = this.productsLength(this.cart);
  }
  productsLength(obj) {
    let count = 0;
    for (const key in obj) {
      count += +obj[key];
    }
    return count;
  }

  order(ev) {
    if (this.productsLength(this.cart) === 0) {
      window.showAlert('Please choose products to order', false);
      return;
    }
    const form = this.cartContainer.querySelector('.form-contacts');
    if (form.checkValidity()) {
      ev.preventDefault();
      fetch('order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: document.querySelector('#client-name').value,
          clientEmail: document.querySelector('#client-email').value,
          cart: this.cart,
          total: this.totalContainer.innerText,
          date: dateForOrder(),
          numberOrder: generateNumberOrder(),
        }),
      })
        .then(response => {
          if (response.status === 200) {
            return response.text();
          } else {
            throw new Error('Cannot send form');
          }
        })
        .then(responseText => {
          form.reset();
          this.cart = {};
          this.saveCart();
          this.updateBadge();
          this.renderCart();
          window.showAlert('Thank you! ' + responseText);
          this.cartContainer.querySelector('.close-modal').click();
        })
        .catch(error => showAlert('There is an error: ' + error, false));
    } else {
      window.showAlert('Please fill form correctly', false);
    }
  }
}
