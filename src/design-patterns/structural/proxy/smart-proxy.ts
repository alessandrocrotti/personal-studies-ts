// Interfaccia della classe
interface ProductService {
  getProduct(id: number): Promise<string>;
}

// Oggetto reale che implementa l'interfaccia
class RealProductService implements ProductService {
  async getProduct(id: number): Promise<string> {
    console.log(`Fetching product ${id} from DB...`);
    await new Promise((res) => setTimeout(res, 500));
    return `Product_${id}`;
  }
}

// Smart proxy che aggiunge logica extra (caching)
class CachingProductProxy implements ProductService {
  private realService = new RealProductService();
  private cache = new Map<number, string>();

  async getProduct(id: number): Promise<string> {
    if (this.cache.has(id)) {
      console.log(`Returning cached product ${id}`);
      return this.cache.get(id)!;
    }

    const product = await this.realService.getProduct(id);
    this.cache.set(id, product);
    return product;
  }
}

// Uso
const productService: ProductService = new CachingProductProxy();

productService.getProduct(1).then(console.log); // Fetch da DB
productService.getProduct(1).then(console.log); // Da cache

// Rende il file un modulo ES6 invece che un file globale
export {};
