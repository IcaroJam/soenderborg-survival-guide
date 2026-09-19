<script lang="ts">
    import type { ParsedProduct, RankingEntry } from "$lib/types";

	const { prod, info }: {prod: ParsedProduct, info: RankingEntry} = $props()

	function formatDkk(n: number) {
		if (!n) return "-"
		return (Math.round((n + Number.EPSILON) * 100) / 100) + " kr."
	}

	function formatPerUnit(n: RankingEntry, p: ParsedProduct) {
		const formattedPrice = formatDkk(n.price / (p.normalizedQuantity))
		if (formattedPrice === "-") return formattedPrice
		return formattedPrice + `/${p.normalizedUnit}`
	}
</script>



<div>
	<span>
		<span class="price">{formatDkk(info.price)}</span>
		<span class="pricePerUnit">{formatPerUnit(info, prod)}</span>
	</span>
	<span class="shopInfo">{info.shop}</span>
</div>



<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 0.9rem;
	}

	.pricePerUnit {
		color: var(--dim3);
		font-size: 0.85rem;
		white-space: nowrap;
	}

	.shopInfo {
		color: var(--yellow);
		font-size: 0.75rem;
	}
</style>