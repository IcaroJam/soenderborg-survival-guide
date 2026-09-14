<script lang="ts">
    import type { ParsedProduct } from "$lib/types";

	const { i, prod }: {i: number, prod: ParsedProduct} = $props()

	function formatDkk(n: number) {
		if (!n && n != 0) return "-"
		return (Math.round((n + Number.EPSILON) * 100) / 100) + "kr."
	}
</script>



<div class="prodWrapper">
	<span>{prod.name}</span>
	<span>{prod.quantity + prod.unit}</span>
	<span>{formatDkk(prod.currBest.basePrice.price)}</span>
	<span>{formatDkk(prod.currBest.withDiscount.price)}</span>
	<span>{formatDkk(prod.allTime.min.price)}</span>
	<span>{formatDkk(prod.allTime.max.price)}</span>
</div>



<style>
	.prodWrapper {
		display: contents;
	}
</style>