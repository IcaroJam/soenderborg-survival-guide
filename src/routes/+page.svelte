<script lang="ts">
    import MarketTable from "$lib/components/MarketTable.svelte";
    import { raw, setSrh } from "$lib/dataStore.svelte";
    import FuzzySearch from "fuzzy-search";

	const haystack = raw().reduce((acc, curr) => [...acc, curr.id], [] as String[])
	const fuzzy = new FuzzySearch(haystack)

	function searchFunc(ev: Event) {
		const matches = new Set(fuzzy.search((ev.target as HTMLInputElement).value)) // This is some fucked up shit
		setSrh(raw().filter(it => matches.has(it.id)))
	}
</script>



<div>
	<div id="mainHeader">
		<span>SuperrrMarkets</span>
		<div id="search">
			<div>
				<svg viewBox="0 0 512 512" transform="scale(-1 1)"><g stroke-linecap="round" stroke-linejoin="round"/><path d="m496.872 423.839-85.357-85.358a248 248 0 0 1-15.392 21.142l-31.484-31.485c1.357-1.771 2.7-3.556 4.014-5.371a151 151 0 0 0 2.596-3.689c.148-.192.28-.398.414-.59a220 220 0 0 0 2.538-3.792c1.8-2.744 3.526-5.518 5.179-8.351 17.691-30.174 27.857-65.291 27.857-102.725s-10.166-72.55-27.857-102.724a205.25 205.25 0 0 0-73.037-73.038C276.168 10.166 241.052 0 203.618 0s-72.55 10.166-102.724 27.858a138 138 0 0 0-3.689 2.228 201 201 0 0 0-12.733 8.499c-.886.634-1.756 1.284-2.627 1.933l-2.744 2.081c-.841.664-1.697 1.328-2.538 2.006a184 184 0 0 0-4.899 4.058 204 204 0 0 0-23.002 23.002 162 162 0 0 0-4.058 4.899c-.678.841-1.343 1.697-2.006 2.538l-2.08 2.744a201 201 0 0 0-10.432 15.36 135 135 0 0 0-2.228 3.689C10.166 131.069 0 166.186 0 203.62s10.166 72.55 27.857 102.725a205.24 205.24 0 0 0 73.037 73.037c30.174 17.692 65.291 27.858 102.724 27.858s72.55-10.166 102.724-27.858a195 195 0 0 0 5.592-3.408c.929-.575 1.844-1.166 2.759-1.77a209 209 0 0 0 3.792-2.538c.192-.133.398-.266.59-.413a154 154 0 0 0 3.689-2.597 243 243 0 0 0 5.371-4.013l31.483 31.483a249 249 0 0 1-21.14 15.393l85.358 85.358C433.913 506.954 447.134 512 460.354 512s26.441-5.046 36.518-15.124c20.17-20.17 20.17-52.867 0-73.037m-212.19-100.556c-.413.295-.826.575-1.254.841-.472.34-.959.649-1.446.959-.442.295-.886.575-1.328.856q-.863.554-1.726 1.062c-.546.34-1.077.664-1.623.989a166 166 0 0 1-3.512 2.021c-.089.059-.177.104-.28.162-.96.531-1.933 1.048-2.907 1.549a18 18 0 0 1-1.166.62c-.767.398-1.549.782-2.33 1.166a125 125 0 0 1-4.516 2.124c-18.016 8.086-37.979 12.586-58.975 12.586s-40.959-4.5-58.975-12.586c-32.403-14.519-58.518-40.635-73.037-73.037C63.52 244.58 59.02 224.616 59.02 203.62s4.5-40.96 12.586-58.976a144 144 0 0 1 7.643-14.711c.325-.546.649-1.077.988-1.623a96 96 0 0 1 2.878-4.5 69 69 0 0 1 1.696-2.494 71 71 0 0 1 2.17-3.054 149 149 0 0 1 3.496-4.589 146.2 146.2 0 0 1 23.195-23.195 151 151 0 0 1 4.589-3.497 72 72 0 0 1 3.054-2.169 69 69 0 0 1 2.494-1.697 98 98 0 0 1 4.5-2.877c.546-.34 1.077-.664 1.623-.989a145 145 0 0 1 14.711-7.643c18.016-8.086 37.979-12.586 58.975-12.586s40.96 4.5 58.975 12.586c32.402 14.519 58.518 40.635 73.037 73.037 8.086 18.016 12.586 37.98 12.586 58.976s-4.5 40.96-12.586 58.976a126 126 0 0 1-2.124 4.515c-.384.782-.768 1.564-1.166 2.332-.192.398-.399.782-.62 1.166-.502.974-1.018 1.948-1.549 2.907-.059.103-.103.192-.162.28a121 121 0 0 1-3.01 5.135 53 53 0 0 1-1.063 1.726c-.28.443-.56.886-.856 1.328-.31.487-.62.974-.959 1.446-.265.428-.546.841-.841 1.254-.28.413-.561.826-.856 1.239a6 6 0 0 1-.516.738 44 44 0 0 1-1.033 1.476 137 137 0 0 1-8.587 10.756c-.545.635-1.106 1.254-1.667 1.874-.723.797-1.446 1.594-2.184 2.361-.856.9-1.741 1.8-2.627 2.686-.884.885-1.785 1.77-2.685 2.626-.767.738-1.564 1.46-2.361 2.184a99 99 0 0 1-1.874 1.667 137 137 0 0 1-10.756 8.588c-.487.354-.989.708-1.476 1.033a6 6 0 0 1-.738.516c-.412.294-.826.575-1.238.855"/></svg>
			</div>
			<input type="text" oninput={searchFunc}>
		</div>
	</div>
	<div id="tableWrapper">
		<MarketTable />
	</div>
</div>



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

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--dim4) var(--bg0);
		box-sizing: border-box;
	}

	:global(body) {
		background-color: var(--bg0);
		color: var(--fg);
		font-family: "Iosevka Charon",Cambria;

		margin: 0;
		padding: 0 2rem;
	}

	#mainHeader {
		font-size: 1.5rem;
		padding: 2rem 0 0 0;

		display: flex;
		align-items: center;
		gap: 1rem;
	}

	#search {
		flex-grow: 1;
		display: flex;
		align-content: center;
		border-radius: 4px;
		border: solid 1px var(--bg3);
		background-color: var(--bg1);
		overflow: hidden;

		& > div {
			width: 2.5rem;
			align-content: center;

			& > svg {
				display: block;
				margin: auto;
				width: 1.25rem;
				fill: var(--fg);
			}
		}

		& > input {
			padding: 0.75rem;
			flex-grow: 1;
			border: none;
			border-radius: 0;
			background-color: var(--bg2);
			color: var(--fg);
		}
	}

	#tableWrapper {
		height: 100vh;
		max-height: 100vh;
		padding: 1rem 0;
	}
</style>