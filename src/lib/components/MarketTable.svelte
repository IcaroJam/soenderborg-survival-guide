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
		height: 100vh;

		display: grid;
		position: relative;
		grid-template-columns: minmax(min-content, max-content) max-content repeat(4, auto);

		border-radius: 4px;
		background-color: var(--bg1);

		overflow: auto;
	}

	:global(.prodWrapper), :global(.headerWrapper) {
		/* All columns except name */
		& > :global(*) {
			padding: 1rem 1.5rem;
			text-align: center;
			align-content: center;
		}
		& > :global(*:first-child) {
			padding: 1rem 0.5rem 1rem 1.5rem;
			text-align: left;
			flex-shrink: 1;
		}
		& > :global(*:nth-child(2)) {
			padding: 1rem 1.5rem 1rem 0.5rem;
			text-align: right;
		}
	}
</style>