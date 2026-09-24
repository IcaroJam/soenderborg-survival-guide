<script lang="ts">
    import { srh, dat, setDat } from "$lib/dataStore.svelte";
    import { dbSortBase, dbSortBasePU, dbSortDisc, dbSortDiscPU, dbSortName, dbSortQtty } from "$lib/util";
    import MTHeaderPerUnitSortTag from "$lib/components/MTHeaderPerUnitSortTag.svelte";
    import MTHeaderSortTag from "$lib/components/MTHeaderSortTag.svelte";

	const lookup = {
		name: dbSortName,
		qtty: dbSortQtty,
		base: dbSortBase,
		basePU: dbSortBasePU,
		disc: dbSortDisc,
		discPU: dbSortDiscPU
	}

	const markets = dat().reduce((acc, curr) => {
		Object.keys(curr.shops).forEach(k => acc.add(k))
		return acc
	}, new Set<string>())

	let active = $state("name" as keyof typeof lookup)
	let sortDir = $state(1)

	$effect(() => {
		setDat(lookup[active](srh(), sortDir))
	})
</script>



<div class="headerWrapper">
	<MTHeaderSortTag txt="Name" key={"name"} bind:active bind:dir={sortDir}/>
	<MTHeaderSortTag txt="Quantity" key={"qtty"} bind:active bind:dir={sortDir}/>
	<MTHeaderPerUnitSortTag txt="BestBase" key={"base"} bind:active bind:dir={sortDir}/>
	<MTHeaderPerUnitSortTag txt="BestDiscount" key={"disc"} bind:active bind:dir={sortDir}/>
	<span>MinPrice</span>
	<span>MaxPrice</span>
</div>



<style>
	.headerWrapper {
		display: contents;
	}

	.headerWrapper {
		& > :global(*) {
			position: sticky;
			top: 0;

			background-color: var(--bg3);
		}
	}
</style>