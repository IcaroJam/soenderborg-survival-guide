<script lang="ts">
    import type { ParsedProduct } from "$lib/types";
    import PriceTag from "./PriceTag.svelte";

	const { i, prod }: {i: number, prod: ParsedProduct} = $props()

	function prodQuantity(prod: ParsedProduct) {
		if (prod.unit != prod.normalizedUnit && prod.normalizedQuantity >= 1)
			return `${prod.normalizedQuantity} ${prod.normalizedUnit}`
		return `${prod.quantity} ${prod.unit}`
	}
</script>



<div class={"prodWrapper" + (i % 2 ? " even" : " odd")}>
	<span>{prod.name}</span>
	<span>{prodQuantity(prod)}</span>
	<PriceTag prod={prod} info={prod.currBest.basePrice} />
	<PriceTag discount={true} prod={prod} info={prod.currBest.withDiscount} />
	<PriceTag prod={prod} info={prod.allTime.min} />
	<PriceTag prod={prod} info={prod.allTime.max} />
</div>



<style>
	.prodWrapper {
		display: contents;

		&.even > :global(*) {
			background-color: var(--bg2);
		}

		&.odd > :global(*) {
			background-color: var(--bg1);
		}
	}
</style>