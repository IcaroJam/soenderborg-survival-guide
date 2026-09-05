export const DISCOUNT_REASONS = [
	"expires-soon/defective-product",
	"coupon",
	"one-time deal",
	"fidelity program"
] as const

export type MarketDB = Array<Product>

export type Product = {
	id: string,
	name: string,
	quantity: number,
	unit: string,
	shops: Shops
}

export type Shops = Record<string, ShopInfo>

export type ShopInfo = {
	priceHistory: Array<Price>,
}

export type Price = {
	date: Date,
	price: number
	discount?: number,
	reason?: (typeof DISCOUNT_REASONS)[number]
}