class ProductList {
  constructor(cart) {
    this.cart = cart;
    this.container = document.querySelector('.products-container');
    this.filterButtons = document.querySelectorAll('.products-filters-button');
    this.productService = new ProductsService();
    this.productService.getProducts().then(products => {
      this.products = products;
      this.renderProductList(products);
      this.addEventListeners();
    });
  }

  createButtonsColor(product) {
    let count = product.image;
    let buttonsListDomString = '';
    let isFirst = true;
    for (let key in count) {
      const uniqueId = `${product.title}-${key}`;
      buttonsListDomString += `
            <input type="radio" name="${product.title}" id="${uniqueId}" ${isFirst ? 'checked' : ''} />
            <label style="background-color: ${count[key].color};
            border: ;" class="card-product-color" for="${uniqueId}" data-id="${product.id}" data-color="${key}"><span style="background-color: ${count[key].color};"></span></label>
        `;
      isFirst = false;
    }
    return buttonsListDomString;
  }

  renderProductList(products) {
    let productListDomString = '';
    products.forEach(product => {
      const isLiked = localStorage.getItem(`liked_${product.id}`) === 'true';
      const heartClass = isLiked ? 'fa-solid' : 'fa-regular';
      productListDomString += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mb-3">
          <div class="card product">
            <div class="card-img-wrapper" data-id="${product.id}">
              <img class="card-img-top" src="img/products/${product.image['1'].link}" alt="${product.title}" />
            </div>
            <div class="card-body d-flex flex-column">
              <h4 class="card-title">${product.title}</h4>
              <p class="card-text">$${product.price}</p>
              <fieldset class="color-buttons" for="${product.title}">
                ${this.createButtonsColor(product)}
              </fieldset>
              <button class="buy-button btn btn-primary" data-color="${product.image['1'].link}" data-id="${product.id}" type="button">ADD TO CART</button>
            </div>
            <div class="card-like-button">
              <button id="heart" data-id="${product.id}"  class="heart-button"><i class="${heartClass} fa-heart"></i></button>
            </div>
          </div>
        </div>`;
    });

    this.container.innerHTML = productListDomString;

    this.container.addEventListener('click', event => {
      const colorButton = event.target.closest('.card-product-color');
      if (colorButton) {
        const product = products.find(el => el.id === colorButton.dataset.id);
        const card = colorButton.closest('.card');
        const imageProduct = card.querySelector('.card-img-top');
        imageProduct.src = `img/products/${product.image[colorButton.dataset.color].link}`;
        const addToCartButton = card.querySelector('.buy-button');
        if (addToCartButton) {
          addToCartButton.setAttribute('data-color', product.image[colorButton.dataset.color].link);
        }
      }
    });
  }

  addEventListeners() {
    this.container.addEventListener('click', event => {
      const heartButton = event.target.closest('.heart-button');
      if (heartButton) {
        const productId = heartButton.dataset.id;
        const isLiked = localStorage.getItem(`liked_${productId}`) === 'true';
        if (isLiked) {
          localStorage.removeItem(`liked_${productId}`);
        } else {
          localStorage.setItem(`liked_${productId}`, 'true');
        }
        heartButton.querySelector('i').classList.toggle('fa-solid');
        heartButton.querySelector('i').classList.toggle('fa-regular');
      }
    });

    document
      .querySelectorAll('.buy-button')
      .forEach(button => button.addEventListener('click', event => this.handleProductBuyClick(event)));

    this.filterButtons.forEach(button =>
      button.addEventListener('click', event => {
        const category = event.target.dataset.filter;
        this.productService.getProductByCategory(category).then(filteredProducts => {
          this.renderProductList(filteredProducts);
          this.filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
        });
      }),
    );
  }

  async handleProductBuyClick(event) {
    const button = event.target;
    const id = button.dataset.id;
    const image = button.dataset.color;
    this.cart.addProduct(id, image);
    window.showAlert('Product added to cart');
  }
}
