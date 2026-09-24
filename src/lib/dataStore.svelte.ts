import type { MarketDB, MarketInfo } from "$lib/types";

// The magic of static sites allows me to just read the file as a normal json
// since the data is read-only
import db from "$lib/db.json";

import { dbSortName, findRelevantInfo } from "$lib/util";

let tmp = findRelevantInfo(db as unknown as MarketDB)
let tmpSorted = dbSortName(tmp, 1)

const DS = $state({
	rawData: tmp,
	searchData: tmpSorted,
	data: tmpSorted
})

export function raw() { return DS.rawData }
export function srh() { return DS.searchData }
export function dat() { return DS.data }
export function setSrh(newVal: MarketInfo) { DS.searchData = newVal }
export function setDat(newVal: MarketInfo) { DS.data = newVal }