<script>
    import MarketTable from "$lib/components/MarketTable.svelte";
</script>



<h1>Imagine a country where food wasn't a fortune</h1>
<MarketTable />



<style>
	@import url('https://fonts.googleapis.com/css2?family=Iosevka+Charon+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Iosevka+Charon:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap');

	:global(:root) {
		--bg0: #1d2021;
		--bg1: #282828;
		--bg2: #32302f;
		--bg3: #3c3836;
		--bg4: #504945;
		--dim0: #665c54;
		--dim1: #7c6f64;
		--dim2: #928374;
		--dim3: #a89984;
		--dim4: #bdae93;
		--dim5: #d5c4a1;
		--dim6: #ebdbb2;
		--fg: #fbf1c7;
		--red: #cc241d;
		--orange: #d65d0e;
		--yellow: #d79921;
		--green: #98971a;
		--teal: #689d6a;
		--blue: #458588;
		--purple: #b16286;
		--bright-red: #fb4934;
		--bright-orange: #fe8019;
		--bright-yellow: #fabd2f;
		--bright-green: #b8bb26;
		--bright-teal: #8ec07c;
		--bright-blue: #83a598;
		--bright-purple: #d3869b;
		--trans-teal: #689d6a32;
	}

	:global(body) {
		background-color: var(--bg0);
		color: var(--fg);
		font-family: "Iosevka Charon",Cambria;

		padding: 1rem 2rem;
	}
</style>