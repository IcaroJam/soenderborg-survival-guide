import type { MarketDB, MarketInfo, ParsedProduct, Product, ProductExtension } from "./types";

function nameOrder(a: Product, b: Product, n: number) {
	return a.name > b.name ? n : a.name < b.name ? -n : 0
}

function qttyOrder(a: Product, b: Product, n: number) {
	return a.quantity > b.quantity ? -n : a.quantity < b.quantity ? n : 0
}

function baseOrder(a: ParsedProduct, b: ParsedProduct, n: number) {
	return a.currBest.basePrice.price > b.currBest.basePrice.price ? -n : a.currBest.basePrice.price < b.currBest.basePrice.price ? n : 0
}

function baseOrderPU(a: ParsedProduct, b: ParsedProduct, n: number) {
	const ap = a.currBest.basePrice.price / a.normalizedQuantity
	const bp = b.currBest.basePrice.price / b.normalizedQuantity
	return ap > bp ? -n : ap < bp ? n : 0
}

export function dbSortName(data: MarketInfo, n: number) {
	return data.sort((a, b) => {
		const first = nameOrder(a, b, n)
		if (first === 0) return qttyOrder(a, b, n)
		return first
	})
}

export function dbSortQtty(data: MarketInfo, n: number) {
	return data.sort((a, b) => {
		const first = qttyOrder(a, b, n)
		if (first === 0) return nameOrder(a, b, n)
		return first
	})
}

export function dbSortBase(data: MarketInfo, n: number) {
	return data.sort((a, b) => {
		const first = baseOrder(a, b, n)
		if (first === 0) return nameOrder(a, b, n)
		return first
	})
}

export function dbSortBasePU(data: MarketInfo, n: number) {
	return data.sort((a, b) => {
		const first = baseOrderPU(a, b, n)
		if (first === 0) return nameOrder(a, b, n)
		return first
	})
}

function unitNormalization(p: Product) {
	if (p.unit === "g")
		return {normalizedQuantity: p.quantity / 1000, normalizedUnit: "kg"}
	if (p.unit === "ml")
		return {normalizedQuantity: p.quantity / 1000, normalizedUnit: "l"}
	return {normalizedQuantity: p.quantity, normalizedUnit: p.unit}
}

/**
 * Normalize the quantity/unit fields and find
 * the best and worst prices and their respective supermarket
 * for each product, both current and all-time.
 */
export function findRelevantInfo(data: MarketDB): MarketInfo {
	data.forEach((prod, i, arr) => {
		const ext: ProductExtension = {
			...unitNormalization(prod),
			currBest: getCurrBest(prod),
			allTime: getAllTimers(prod)
		}
		arr[i] = {...prod, ...ext}
	})
	return data as MarketInfo
}

function getCurrBest(p: Product) {
	const ret = {
		basePrice: {price: null as any, shop: null as any},
		withDiscount: {price: null as any, shop: null as any}
	}
	Object.entries(p.shops).forEach(([k, s]) => {
		if (ret.basePrice.price === null || s.priceHistory[0].price < ret.basePrice.price) {
			ret.basePrice.price = s.priceHistory[0].price
			ret.basePrice.shop = k
		}
		for (let p of s.priceHistory) {
			if (p.discount) {
				const tmp = p.price - p.discount
				if (ret.withDiscount.price === null || (tmp < ret.withDiscount.price)) {
					ret.withDiscount.price = tmp
					ret.withDiscount.shop = k
				}
				break
			}
		}
	})
	return ret
}

function getAllTimers(p: Product) {
	const ret = {
		min: {price: null as any, shop: null as any},
		max: {price: null as any, shop: null as any}
	}
	Object.entries(p.shops).forEach(([k, s]) => {
		for (let p of s.priceHistory) {
			if (ret.min.price === null || (p.price < ret.min.price)) {
				ret.min.price = p.price
				ret.min.shop = k
			}
			if (ret.max.price === null || (p.price > ret.max.price)) {
				ret.max.price = p.price
				ret.max.shop = k
			}
		}
	})
	return ret
}