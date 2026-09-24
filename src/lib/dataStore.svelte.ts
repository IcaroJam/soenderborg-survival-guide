import type { MarketDB, MarketInfo } from "$lib/types";

// The magic of static sites allows me to just read the file as a normal json
// since the data is read-only
import db from "$lib/db.json";

import { dbSortName, findRelevantInfo } from "$lib/util";

let tmp = findRelevantInfo(db as unknown as MarketDB)

const DS = $state({
	rawData: tmp,
	data: dbSortName(tmp, 1)
})

export function raw() { return DS.rawData }
export function dat() { return DS.data }
export function setDat(newVal: MarketInfo) { DS.data = newVal }