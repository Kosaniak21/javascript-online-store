class ProductsService {
  constructor() {
    if (!ProductsService._instance) ProductsService._instance = this;
    return ProductsService._instance;
  }
  async getProducts() {
    if (!this.products) {
      const response = await fetch('products.json');
      const data = await response.json();
      this.products = data;
    }
    return this.products;
  }

  async getProductById(input) {
    const { id, image } = JSON.parse(input);
    const products = await this.getProducts();
    const product = products.find(product => product.id === id);
    return { product, image };
  }

  async getProductByCategory(category) {
    let products = await this.getProducts();
    if (category === 'all') {
      return products;
    }
    let filteredProducts = products.filter(product => product.category === category);
    return filteredProducts;
  }
}
