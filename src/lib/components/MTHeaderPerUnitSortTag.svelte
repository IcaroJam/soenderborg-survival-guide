<script lang="ts">
    import MTHeaderSortTag from "./MTHeaderSortTag.svelte";

	let { txt, key, active = $bindable(), dir = $bindable() } = $props()
</script>



<div class="doubleTagWrapper">
	<MTHeaderSortTag txt={txt} key={key} bind:active bind:dir />
	<MTHeaderSortTag txt="Per unit" key={key + "PU"} bind:active bind:dir />
</div>



<style>
	.doubleTagWrapper {
		& > :global(div) {
			font-size: 0.9rem;
		}

		& > :global(div):nth-child(2) {
			color: var(--dim3);
			font-size: 0.85rem;
		}
	}
</style>