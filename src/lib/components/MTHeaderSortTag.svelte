<script lang="ts">
	let { txt, active = $bindable(), dir = $bindable() } = $props()

	function toggleSort() {
		if (active === txt) {
			dir = -dir
		} else {
			active = txt
			dir = 1
		}
	}
</script>



<div role="button" tabindex="0" onmousedown={toggleSort}>
	<span>{txt}</span>
	<span class={"arrow " + (active != txt ? "arDim" : dir === 1 ? "arDown" : "arUp")}>
		{active === txt ? "▴" : "•"}
	</span>
</div>



<style>
	div {
		cursor: pointer;
		user-select: none;
	}

	.arrow {
		display: inline-block;
	}

	.arDim {
		color: lightgray;
	}

	.arDown {
		transform: rotate(180deg);
	}
</style>