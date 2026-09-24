<script lang="ts">
    import Product from "$lib/components/Product.svelte";
    import MTHeader from "$lib/components/MTHeader.svelte";
	import { dat } from "$lib/dataStore.svelte";
</script>



<div id="marketTable">
	<MTHeader/>
	{#each dat() as item, i}
		<Product i={i} prod={item}/>
	{/each}
</div>



<style>
	#marketTable {
		max-height: 100%;

		display: grid;
		position: relative;
		grid-template-columns: minmax(min-content, max-content) max-content repeat(4, auto);
		grid-auto-rows: max-content;

		border-radius: 4px;
		border: solid 1px var(--bg3);
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