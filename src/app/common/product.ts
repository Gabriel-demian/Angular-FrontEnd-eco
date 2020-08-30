// has all the data that is read from the backend, if we modify the product atributes in the backend we must actualice this class.
export class Product {  
    id: string;
    sku: string;
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdate: Date;
}
