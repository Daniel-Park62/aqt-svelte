<script>
	import DashBoard from "./components/DashBoard.svelte";
	import ByTcode from "./components/ByTcode.svelte";
	import ByTask from "./components/ByTask.svelte";
	import RegApp from "./components/RegApp.svelte";
import TrList from "./components/TrList.svelte";

	let mitems = [
		{ nm: "총괄 현황", url: "dashboard", cnm: DashBoard },
		{ nm: "테스트별 수행현황", url: "bytcode", cnm: ByTcode },
		{ nm: "업무별 수행현황", url: "bytask", cnm: ByTask },
		{ nm: "상세수행현황", url: "detail", cnm: DashBoard },
		{ nm: "수행결과비교", url: "comp", cnm: DashBoard },
		{ nm: "전문처리현황", url: "view", cnm: DashBoard },
		{ nm: "전문상세검색", url: "view", cnm: TrList },
	];

	let mitems2 = [
		{ nm: "1. App 등록", url: "regapp", cnm: RegApp },
		{ nm: "2. 서비스 등록", url: "regsvc", cnm: ByTcode },
		{ nm: "3. 테스트등록/전문생성", url: "regtcode", cnm: DashBoard },
		{ nm: "4. 테스트 실행", url: "aqtexec", cnm: TrList },
	];

	let selected = mitems[0];
	function select_item(item) {
		selected = item;
	}
</script>

<main class="container">
		<div class="column menu">
			<img src="/images/Logo.png" alt="" />
			<p />
			<img src="/images/result.png" alt="" />
			<ul>
				{#each mitems as item}
					<li on:click={() => select_item(item)}>{item.nm}</li>
				{/each}
			</ul>
			<hr style="color:cornsilk">
			<img src="/images/operating.png" alt="" />
			<ul>
				{#each mitems2 as item}
					<li on:click={() => select_item(item)}>{item.nm}</li>
				{/each}
			</ul>

		</div>

		<div class="column right">
			<div class="job_name">{selected.nm}</div>
			<div class="main-scr"><svelte:component this={selected.cnm} /></div>
		</div>
</main>

<style>
	main {
		font-family: "나눔바른고딕", "Lato", "Nanum Barun Gothic", sans-serif;
		text-align: center;
		padding: 0;
		width: 100%;
		height:96vh;
		margin: 0 auto;
		display: flex;
	}
	.column {
		margin: 5px;
		padding: 5px;
	}

	.menu {
		flex-basis: 280px;
		/* height: 100%; */
		color: rgb(248, 241, 241);
		background-color: blue;
		text-align: left;
	}

	.right {
		/* width: 80%; */
		/* height: 92vh; */
		/* max-width: 80%; */
		/* border: 2px solid rgb(185, 199, 206); */
		background-color: rgb(254, 255, 255);
		flex: 1 1 0;
		/* float: right; */
		overflow: auto;
		display: flex;
		flex-direction: column;
		border: 1px outset rgb(238, 238, 238) ;
		box-shadow: 0 2px 4px gray;
	}

	.main-scr {
		flex: 1 1 0;
	}
	.menu img {
		padding: 3px 0px 0px 3px;
		margin: 0px;
	}

	.menu > ul {
		font-family: "나눔바른고딕";
		list-style: none;
		padding: 0px;
		font-size: 1.2rem;
		margin: 0px;
	}
	.menu li {
		cursor: pointer;
		padding: 10px 20px;
	}
	.menu li:hover {
		text-decoration: underline;
	}

	.right .job_name {
		text-align: left;
		color: orangered;
		text-transform: uppercase;
		text-shadow: 1px 1px 0px #bdbdbd;
		font-size: 1.5em;
		font-weight: 500;
		padding: 5px;
		border: 1px solid rgb(245, 239, 239);
		border-radius: 6px;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
