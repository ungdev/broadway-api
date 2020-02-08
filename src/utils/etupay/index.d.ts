declare module '@ung/node-etupay' {
  interface Initializer {
    id: number;
    url: string;
    key: string;
  }

  export default function initialize(initializer: Initializer): string;

  export class Basket {
    constructor(title: string, firstname: string, lastname: string, email: string, type: string, data: string);

    addItem(name: string, price: number, quantity: number): void;
    compute(): string;
  }
}
