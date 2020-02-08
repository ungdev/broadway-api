declare module '@ung/node-etupay' {
  interface Initializer {
    id: number;
    url: string;
    key: string;
  }

  class Basket {
    constructor(title: string, firstname: string, lastname: string, email: string, type: string, data: string);

    addItem(name: string, price: number, quantity: number): void;

    compute(): string;
  }

  interface InitializerReturn {
    Basket: typeof Basket;
  }

  export default function initialize(initializer: Initializer): InitializerReturn;
}
