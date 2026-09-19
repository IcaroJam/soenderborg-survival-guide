<script lang="ts">
	let { txt, key, active = $bindable(), dir = $bindable() } = $props()

	function toggleSort() {
		if (active === key) {
			dir = -dir
		} else {
			active = key
			dir = 1
		}
	}
</script>



<div role="button" tabindex="0" onmousedown={toggleSort}>
	<span>{txt}</span>
	<span class={"arrow " + (active != key ? "arDim" : dir === 1 ? "arDown" : "arUp")}>
		{active === key ? "▴" : "•"}
	</span>
</div>



<style>
	div {
		cursor: pointer;
		user-select: none;
	}

	.arrow {
		margin-left: -4px;
		width: 1rem;
		display: inline-block;
		text-align: center;
	}

	.arDim {
		color: var(--dim2);
	}

	.arDown {
		transform: rotate(180deg);
	}
</style>