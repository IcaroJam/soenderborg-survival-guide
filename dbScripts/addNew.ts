import { JSONFileSyncPreset } from "lowdb/node"
import { DISCOUNT_REASONS, type MarketDB, type Price, type Product } from "../src/lib/types.ts"
import { exit } from "node:process"
import * as readline from "node:readline"

const discountTxt = DISCOUNT_REASONS.reduce((acc: string, curr, i) => acc.concat(`\t${i + 1}: ${curr}\n`), "")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer
})

const db = JSONFileSyncPreset<MarketDB>("src/lib/db.json", [])

const completions = {
	name: getUnique(el => el.name),
	quantity: getUnique(el => el.quantity.toString()),
	unit: getUnique(el => el.unit),
	shop: getUniqueShops(),
	price: getUniqueEntries(p => p.price.toString()),
	date: getUniqueEntries(p => p.date.split("T")[0]),
	discount: getUniqueEntries(p => p.discount?.toString()),

}
let currCompl: keyof typeof completions = "name"

// Basic info
let modFlag = false
const prod: Product = await new Promise(resolve => {

	rl.question("Enter product name: ", name => {

		currCompl = "quantity"
		rl.question("Enter product quantity: ", qtty => {
			const quantity = validateNum(qtty)

			currCompl = "unit"
			rl.question("Enter product units: ", unit => {
				const id = idFrom(name, quantity, unit)
				const tmp = findInDB(id)
				if (!tmp) {
					console.log("Creating a new product...\n")
					resolve({id, name, quantity, unit, shops: {}})
				} else {
					modFlag = true
					console.log(`Product found!\n`)
					resolve(tmp)
				}
			})
		})
	})
})

// Shop info
await new Promise<void>(resolve => {
	currCompl = "shop"
	rl.question("Enter supermarket name: ", async superMark => {
		if (prod.shops.hasOwnProperty(superMark)) {
			console.log("Supermarket already registered for this product. Continuing...\n")
		} else {
			console.log("Registering new supermarket for this product...\n")
			prod.shops[superMark] = {
				priceHistory: [],
			}
		}

		let baseHist = prod.shops[superMark].priceHistory
		await new Promise<void>(resolve => {
			currCompl = "price"
			rl.question("Base price: ", p => {
				const price = validateNum(p)

				currCompl = "date"
				rl.question("Enter date as YYYY-MM-DD: ", async d => {
					const date = validateDate(d)

					if (baseHist.find(p => p.date === date))
						erxit("This date entry is already present. To modify run the 'modify' script.")

					const nPrice: Price = {date, price}
					await new Promise<void>(resolve => {
						currCompl = "discount"
						rl.question("Discount (leave empty to skip): ", d => {
							if (!d) {
								console.log("Skipping discount\n")
								resolve()
								return
							}
							nPrice.discount = validateNum(d)
							rl.question(`Discount reason:\n${discountTxt}`, r => {
								const i = validateNum(r) - 1
								if (i >= DISCOUNT_REASONS.length)
									erxit("Provided index too big.")
								nPrice.reason = DISCOUNT_REASONS[i]
								resolve()
							})
						})
					})

					baseHist.push(nPrice)
					baseHist.sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0)
					prod.shops[superMark].priceHistory = baseHist.reduce((acc: Price[], curr) => {
						if (acc.length == 0 || acc[0].price != curr.price || acc[0].discount != curr.discount || acc[0].reason != curr.reason)
							acc.unshift(curr)
						return acc
					}, [])
					resolve()
				})
			})
		})
		resolve()
	})
})

// Confirm and save
console.log(`The product will be saved as:\n${JSON.stringify(prod, null, "\t")}\n`)
rl.question("Confirm? (y/n) ", async answer => {
	if (answer === "y") {
		if (modFlag) {
			console.log("modifying existing product...\n")
		} else {
			console.log("Saving new product...\n")
			db.data.push(prod)
		}
		await db.write()
		console.log("Changes saved to the DB!\n")
	} else {
		console.log("Changes cancelled.")
	}
	rl.close()
})



function erxit(msg: string) {
	console.error(msg)
	rl.close()
	exit(1)
}

function validateDate(str: string): string {
	const tmp = Date.parse(str)
	if (isNaN(tmp))
		erxit("Provided string isn't a valid date.")
	return new Date(tmp).toISOString()
}

function validateNum(str: string): number {
	const tmp = parseFloat(str)
	if (isNaN(tmp) || tmp <= 0)
		erxit("Provided string must be a valid number greater than 0.")
	return tmp
}

function idFrom(name: string, quantity: number, unit: string): string {
	if (!name || !quantity || !unit)
		erxit("New products require a valid name, quantity and unit.\n")
	return name + quantity + unit
}

function findInDB(id: string): Product | undefined {
	return db.data.find(it => it.id === id)
}

function completer(line: string) {
	const matching = completions[currCompl].filter(c => c.startsWith(line))
	return [matching, line]
}

function getUnique(getter: (el: Product) => string) {
	const list = db.data.reduce((acc, curr) => {
		acc.add(getter(curr))
		return acc
	}, new Set<string>())
	return Array.from(list)
}

function getUniqueShops() {
	const list = db.data.reduce((acc, curr) => {
		Object.keys(curr.shops).forEach(sh => acc.add(sh))
		return acc
	}, new Set<string>())
	return Array.from(list)
}

function getUniqueEntries(getter: (el: Price) => string | undefined) {
	const list = db.data.reduce((acc, curr) => {
		for (let k in curr.shops) {
			curr.shops[k].priceHistory.forEach(p => {
				const tmp = getter(p)
				if (tmp)
					acc.add(tmp)
			})
		}
		return acc
	}, new Set<string>())
	return Array.from(list)
}