<script>
  import { getComparator, formatDate, formatDateTime } from "../helpers.js";
  import Button from "./Button.svelte";
  import DetailTR from "./DetailTR.svelte";

  const columns = ['ID','송신시간','소요시간','Method','URI','Status','수신크기','수신헤더','TID'];
  let vid = 'none';
  let pid ;
  let data = [];
  let pg = 1;

  export let conds = {
    tcode: "%",
    rcode: '',
    page: 0,
    psize: 20,
    cond: "",
    uri: ""
  };
  
  let sortColumn = null;
  let sortDirection = null;

  $: getTRlist(conds) ;

  async function getTRlist() {
    pg = conds.page+1 ;
    const res = await fetch( "/trlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conds),
    });
    if (res.ok) {
      data = await res.json();
    } else {
      data = [];
      throw new Error(res) ; 
    }

  }

  function sortBy(column) {
    const sameColumn = column === sortColumn;
    const currentlyAscending = sortDirection === "ASC";
    const unsetSort = sameColumn && !currentlyAscending;

    sortColumn = unsetSort ? null : column;
    sortDirection = unsetSort
      ? null
      : sameColumn && currentlyAscending
      ? "DESC"
      : "ASC";
  }

  function sortData() {
    let items = [...data];

    if (!data.length) return data;

    const type = typeof data[0][sortColumn.toLowerCase()];

    items.sort(getComparator(type, sortColumn));

    return sortDirection === "ASC" ? items : items.reverse();
  }

  $: display = sortColumn && sortDirection ? sortData() : [...data];
  $: conds.page = pg - 1 ;
</script>

<style>
    .elapsed {
    min-width: 5em;
  }
  .stime {
    min-width: 8em;
  }
  .rhead, .uri {
    text-align: left;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    height: 70%;
    overflow: auto;
  }
  thead {
    max-height: 1.2em;
    position: sticky;
    top: 0;
  }
  th {
    padding-left: 5px;
    max-width: 20%;
    text-align: center;
    border-right: 1px solid #f0f2fa;
  }

  /* th:first-child {
    left: 0;
    z-index: 1;
    border-right: 1px solid #f0f2fa;
  } */

  td {
    margin: 0;
    padding: 0.5rem;
    vertical-align: top;
    text-align: inherit;
    font-size: 0.9rem;
    max-width: 20%;
    background-color: #ffffff;
    border-right: 1px solid #f0f2fa;
  }

  /* td:first-child {
    position: sticky;
    left: 0;
    top: auto;
    border-right: 1px solid #f0f2fa;
  } */

  tbody tr:nth-child(odd) td {
    background-color: #fafbff;
  }

  thead th:first-child {
    border-top-left-radius: 5px;
  }

  thead th:last-child {
    border-top-right-radius: 5px;
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 5px;
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 5px;
  }

  tbody tr:hover {
    background-color: #ddd;
  }

  .cond {
    display:flex ;
    align-items: baseline ;
  }
  .cond * {
    margin: 2px 4px;
    padding: 2px 3px;
    height: 1.7rem;
  }
  .cond button {
    width: 4em;
  }
  .number-in input{
    max-width: 60px;
    text-align: right;
  }
  .tbl {
    height: 60%;
  }
</style>
<div class="cond">
  <span class="number-in">
    Page :<input  type="number" min=1 bind:value={pg}/> 
    Page크기 :<input  type="number" min=1 bind:value={conds.psize}/>
  </span>
  
  {#if display.length > conds.page }<button on:click={() => { pg = pg + 1; } }> Next &gt;</button> {/if}
  {#if pg > 1  } <button on:click={() => { pg = pg - 1; } }> &lt; Prev </button> {/if}
</div>
<div class="tbl">
<table>
  <thead>
    <tr>
      {#each columns as column}
      <th>
        <Button {sortBy} {column} {sortColumn} {sortDirection} />
      </th>
    {/each}
</tr>
  </thead>
  <tbody>
    {#each display as row}
    <tr class="{row.sflag}" on:dblclick={ () => { pid = row.pkey; vid = 'block'} } >
      <td class="cmpid"><strong><em>{row.id}</em></strong></td>
      <td class="stime">{row.송신시간.substring(5,21)}</td>
      <td class="elapsed">{Math.round(row.소요시간 * 1000) / 1000 }</td>
      <td class="methos">{row.method}</td>
      <td class="uri">{row.uri}</td>
      <td class="rcode">{row.status}</td>
      <td class="rlen">{row.수신크기.toLocaleString("ko-KR")}</td>
      <td class="rhead">{row.수신헤더}</td>
      <td class="tcode">{row.tid}</td>
    </tr>
    {/each}
  </tbody>
</table>
</div>
<DetailTR bind:vid bind:pid/>