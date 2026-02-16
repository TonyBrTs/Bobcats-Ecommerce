/**
 * Represents a product in the system.
 */
export interface Product {
    id: number
    name: string
    price: number
    imageUrl: string
    description: string
    unitsInStock: number
    colors?: string[]
    colorImages?: { [key: string]: string | undefined };
    sizes?: string[]
    categories?: string[]
    subcategories?: string[]
    originalPrice?: number // si está en descuento
}