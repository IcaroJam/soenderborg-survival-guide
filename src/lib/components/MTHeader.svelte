<script lang="ts">
    import type { MarketInfo } from "$lib/types";
    import { dbSortName, dbSortQtty } from "$lib/util";
    import MTHeaderSortTag from "./MTHeaderSortTag.svelte";

	const lookup = {
		Name: dbSortName,
		Quantity: dbSortQtty
	}

	let { data = $bindable() }: {data: MarketInfo} = $props()

	const markets = data.reduce((acc, curr) => {
		Object.keys(curr.shops).forEach(k => acc.add(k))
		return acc
	}, new Set<string>())

	let active = $state("Name" as keyof typeof lookup)
	let sortDir = $state(1)

	$effect(() => {
		lookup[active](data, sortDir)
	})
</script>



<div class="headerWrapper">
	<MTHeaderSortTag txt="Name" bind:active bind:dir={sortDir} />
	<MTHeaderSortTag txt="Quantity" bind:active bind:dir={sortDir} />
	<span>BestBase</span>
	<span>BestDiscount</span>
	<span>MinPrice</span>
	<span>MaxPrice</span>
</div>



<style>
	.headerWrapper {
		display: contents;
	}

	.headerWrapper {
		/* Quantity */
		& > :global(*:nth-child(2)) {
			/* text-align: center; */
		}
	}
</style>