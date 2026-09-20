import type { MarketDB, MarketInfo, ParsedProduct, Product, ProductExtension } from "./types";

function strOrder(a: string, b: string, n: number) {
	return a > b ? n : a < b ? -n : 0
}

function numOrder(a: number, b: number, n: number) {
	return a > b ? -n : a < b ? n : 0
}

export function dbSortName(data: MarketInfo, n: number) {
	return data.toSorted((a, b) => {
		const first = strOrder(a.name, b.name, n)
		if (first === 0) return numOrder(a.quantity, b.quantity, 1)
		return first
	})
}

export function dbSortQtty(data: MarketInfo, n: number) {
	return data.toSorted((a, b) => {
		const first = numOrder(a.quantity, b.quantity, n)
		if (first === 0) return strOrder(a.name, b.name, 1)
		return first
	})
}

export function dbSortBase(data: MarketInfo, n: number) {
	return data.toSorted((a, b) => {
		const first = numOrder(a.currBest.basePrice.price, b.currBest.basePrice.price, n)
		if (first === 0) return strOrder(a.name, b.name, 1)
		return first
	})
}

export function dbSortBasePU(data: MarketInfo, n: number) {
	return data.toSorted((a, b) => {
		const ap = a.currBest.basePrice.price / a.normalizedQuantity
		const bp = b.currBest.basePrice.price / b.normalizedQuantity
		const first = numOrder(ap, bp, n)
		if (first === 0) return strOrder(a.name, b.name, 1)
		return first
	})
}

export function dbSortDisc(data: MarketInfo, n: number) {
	return data.filter(it => it.currBest.withDiscount.price)
	.toSorted((a, b) => {
			const ad = a.currBest.basePrice.price - a.currBest.withDiscount.price
			const bd = b.currBest.basePrice.price - b.currBest.withDiscount.price
			const first = numOrder(ad, bd, n)
			if (first === 0) return strOrder(a.name, b.name, 1)
			return first
	})
}

export function dbSortDiscPU(data: MarketInfo, n: number) {
	return data.filter(it => it.currBest.withDiscount.price)
	.toSorted((a, b) => {
			const ap = (a.currBest.basePrice.price - a.currBest.withDiscount.price) / a.normalizedQuantity
			const bp = (b.currBest.basePrice.price - b.currBest.withDiscount.price) / b.normalizedQuantity
			const first = numOrder(ap, bp, n)
			if (first === 0) return strOrder(a.name, b.name, 1)
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