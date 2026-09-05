import { JSONFileSyncPreset } from "lowdb/node"
import { DISCOUNT_REASONS, type MarketDB, type Price, type Product } from "../src/lib/types"
import { exit } from "node:process"
import * as readline from "node:readline"

const discountTxt = DISCOUNT_REASONS.reduce((acc: string, curr, i) => acc.concat(`\t${i + 1}: ${curr}\n`), "")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const db = JSONFileSyncPreset<MarketDB>("src/lib/db.json", [])

// Basic info
let modFlag = false
const prod: Product = await new Promise(resolve => {

	rl.question("Enter product name: ", name => {

		rl.question("Enter product quantity: ", qtty => {
			const quantity = validateNum(qtty)

			rl.question("Enter product units: ", unit => {
				const id = idFrom(name, quantity, unit)
				const tmp = findInDB(id)
				if (!tmp) {
					console.log("Creating a new product...\n")
					resolve({id, name, quantity, unit, shops: {}})
				} else {
					modFlag = true
					console.log(`Product found!\n${tmp}\n`)
					resolve(tmp)
				}
				rl.close()
			})
		})
	})
})

// Shop info
await new Promise<void>(resolve => {
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
			rl.question("Base price: ", p => {
				const price = validateNum(p)

				rl.question("Enter date as YYYY/MM/DD: ", async d => {
					const date = validateDate(d)

					if (baseHist.find(p => p.date === date))
						erxit("This date entry is already present. To modify run the 'modify' script.")

					const nPrice: Price = {date, price}
					await new Promise<void>(resolve => {
						rl.question("Discount (leave empty to skip): ", d => {
							if (!d) {
								console.log("Skipping discount\n")
								resolve()
							}
							nPrice.discount = validateNum(d)
							rl.question(`Discount reason:\n${discountTxt}`, r => {
								const i = validateNum(r) - 1
								if (i >= DISCOUNT_REASONS.length)
									erxit("Provided index too big.")
								nPrice.reason = DISCOUNT_REASONS[i]
								resolve()
								rl.close()
							})
						})
					})

					baseHist.push(nPrice)
					baseHist.sort((a, b) => b.date.getTime() - a.date.getTime())
					baseHist = baseHist.reduce((acc: Price[], curr) => {
						if (acc.length == 0 || acc[acc.length - 1].price != curr.price)
							acc.push(curr)
						return acc
					}, [])
					resolve()
					rl.close()
				})
			})
		})
		resolve()
		rl.close()
	})
})

// Confirm and save
console.log(`The product will be saved as:\n${prod}\n`)
rl.question("Confirm? (y/n)", async answer => {
	if (answer === "y") {
		await db.write()
		console.log("Changes saved to the DB!\n")
	} else if (answer === "n") {
		console.log("Changes cancelled.")
	}
})



function erxit(msg: string) {
	console.error(msg)
	exit(1)
}

function validateDate(str: string): Date {
	const tmp = Date.parse(str)
	if (isNaN(tmp))
		erxit("Provided string isn't a valid date.")
	return new Date(tmp)
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