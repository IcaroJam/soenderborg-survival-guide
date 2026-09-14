<script lang="ts">
    import type { MarketDB } from "$lib/types";
    import Product from "./Product.svelte";

	// The magic of static sites allows me to just read the file as a normal json
	// since the data is read-only
	import db from "$lib/db.json"

    import { dbSortName, dbSortQtty, findRelevantInfo } from "$lib/util";
    import MTHeader from "./MTHeader.svelte";

	let data = $state(findRelevantInfo(dbSortName(db as unknown as MarketDB, 1)))
</script>



<div id="marketTable">
	<MTHeader bind:data={data} />
	{#each data as item, i}
		<Product i={i} prod={item} />
	{/each}
</div>



<style>
	#marketTable {
		display: grid;
		grid-template-columns: repeat(6, auto);
	}

	:global(.prodWrapper), :global(.headerWrapper) {
		/* All columns except name */
		& > :global(*) {
			text-align: center;
		}
		& > :global(*:first-child) {
			text-align: left;
		}
	}
</style>