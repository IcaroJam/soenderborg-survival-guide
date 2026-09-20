<script lang="ts">
    import type { ParsedProduct, RankingEntry } from "$lib/types";

	const { prod, info, discount }: {prod: ParsedProduct, info: RankingEntry, discount?: boolean} = $props()

	function formatDkk(n: number) {
		if (!n) return "-"
		return (Math.round((n + Number.EPSILON) * 100) / 100) + " kr."
	}

	function formatPerUnit(n: RankingEntry, p: ParsedProduct) {
		const formattedPrice = formatDkk(n.price / p.normalizedQuantity)
		if (formattedPrice === "-") return formattedPrice
		return formattedPrice + `/${p.normalizedUnit}`
	}
</script>



<div>
	{#if discount && info.price}
		<span>
			<span>{formatDkk(info.price)}</span>
			<span class="discount">{"-" + formatDkk(prod.currBest.basePrice.price - info.price)}</span>
		</span>
		<span>
			<span class="pricePerUnit">{formatPerUnit(info, prod)}</span>
			<span class="discount tiny">{"-" + formatDkk((prod.currBest.basePrice.price / prod.normalizedQuantity) - (info.price / prod.normalizedQuantity))}</span>
		</span>
	{:else}
		<span>{formatDkk(info.price)}</span>
		<span class="pricePerUnit">{formatPerUnit(info, prod)}</span>
	{/if}
	<span class="shopInfo">{info.shop}</span>
</div>



<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 0.9rem;
		white-space: nowrap;
	}

	.discount {
		padding: 0.15rem;
		background-color: var(--trans-teal);
		border-radius: 4px;
		color: var(--bright-teal);
		font-size: 0.75rem;
		vertical-align: top;

		&.tiny {
			font-size: 0.54rem;
			vertical-align: middle;
		}
	}

	.pricePerUnit {
		color: var(--dim3);
		font-size: 0.85rem;
	}

	.shopInfo {
		color: var(--yellow);
		font-size: 0.75rem;
	}
</style>