class ProductList {
  constructor(cart) {
    this.cart = cart;
    this.container = document.querySelector('.products-container');
    this.filterButtons = document.querySelectorAll('.products-filters-button');
    this.productService = new ProductsService();
    this.productService
      .getProducts()
      .then(() => this.renderProducts())
      .then(() => this.addEventListeners());
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
  async renderProducts() {
    let productListDomString = '';
    let products = await this.productService.getProducts();
    products.forEach(product => {
      productListDomString += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
  <div class="card product">
    <div class="card-img-wrapper">
      <img class="card-img-top" src="img/products/${product.image['1'].link}" alt="${product.title}" />
    </div>
    <div class="card-body d-flex flex-column">
      <h4 class="card-title">${product.title}</h4>
      <p class="card-text">$${product.price}</p>
      <fieldset class="color-buttons" for="${product.title}">
        ${this.createButtonsColor(product)}
      </fieldset>
    </div>
    <div class="card-like-button">
      <button id="heart" data-id="${product.id}"><i id="heart-icon" class="fa-regular fa-heart"></i></button>
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
      }
      const heartButton = event.target.closest('#heart');
      if (heartButton) {
        const heartIcon = heartButton.querySelector('i');
        heartIcon.classList.toggle('fa-regular');
        heartIcon.classList.toggle('fa-solid');
      } else if (event.target.matches('#heart-icon')) {
        const heartIcon = event.target;
        heartIcon.classList.toggle('fa-regular');
        heartIcon.classList.toggle('fa-solid');
      }
    });
  }

  addEventListeners() {
    document
      .querySelectorAll('.product .btn-info')
      .forEach(button => button.addEventListener('click', event => this.handleProductInfoClick(event)));
    document
      .querySelectorAll('.card.product button.buy, #productInfoModal button.buy')
      .forEach(button => button.addEventListener('click', event => this.handleProductBuyClick(event)));
    this.filterButtons.forEach(button =>
      button.addEventListener('click', event => {
        const category = event.target.dataset.filter;
        this.productService.getProductByCategory(category).then(filteredProducts => {
          this.renderFilteredProducts(filteredProducts);
          this.filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
        });
      }),
    );
  }

  async renderFilteredProducts(filteredProducts) {
    let productListDomString = '';
    filteredProducts.forEach(product => {
      productListDomString += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
        <div class="card product">
          <div class="card-img-wrapper">
            <img class="card-img-top" src="img/products/${product.image['1'].link}" alt="${product.title}" />
          </div>
          <div class="card-body d-flex flex-column">
            <h4 class="card-title">${product.title}</h4>
            <p class="card-text">$${product.price}</p>
            <div class="color-buttons">
              ${this.createButtonsColor(product)}
            </div>
          </div>
          <div class="card-like-button">
            <button id="heart" data-id="${product.id}"><i id="heart-icon" class="fa-regular fa-heart"></i></button>
          </div>
        </div>
      </div>`;
    });
    this.container.innerHTML = productListDomString;
  }
  async handleProductInfoClick(event) {
    const button = event.target; // Button that triggered the modal
    const id = button.dataset.id; // Extract info from data-* attributes
    const product = await this.productService.getProductById(id);
    const modal = document.querySelector('#productInfoModal');
    const productImg = modal.querySelector('.modal-body .card-img-top');
    productImg.setAttribute('src', 'img/products/' + product.image);
    productImg.setAttribute('alt', product.title);
    modal.querySelector('.modal-body .card-title').innerText = product.title;
    modal.querySelector('.modal-body .card-text').innerText = product.description;
    const btnBuy = modal.querySelector('button.buy');
    btnBuy.innerText = `${product.price} - Buy`;
    btnBuy.dataset.id = id;
  }
  handleProductBuyClick(event) {
    const button = event.target;
    const id = button.dataset.id;
    this.cart.addProduct(id);
    window.showAlert('Product added to cart');
  }
}
