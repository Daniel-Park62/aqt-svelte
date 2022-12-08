<script>
  import { getComparator, formatDate, formatDateTime } from "../helpers.js";
  import DetailTR from "./DetailTR.svelte";

  const columns = [
    "ID",
    "송신시간",
    "소요시간",
    "Method",
    "URI",
    "Status",
    "수신크기",
    "수신헤더",
    "TID",
  ];
  let vid = "none";
  let pid;
  export let conds = {
    tcode: "",
    rcode: "",
    page: 0,
    psize: 20,
    cond: "",
    uri: "",
  };

  let rdata = Promise.resolve([]);

  let sortColumn = null;
  let sortDirection = null;
  let pg = conds.page + 1  ;

  $: if(conds.tcode > ' ' ) { getTRlist();}
  
  async function getTRlist() {
    console.log("entr ...", conds) ;
    if (conds.tcode == undefined) return Promise.resolve([]);
    pg = conds.page + 1  ;
    const res = await fetch("/trlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conds),
    });
    if (res.ok) {
      rdata = await res.json();
          //  console.log("trlist end", rdata) ;
    } else {
      rdata = Promise.resolve([]);
      throw new Error(res);
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
    let items = [...rdata];

    if (!rdata.length) return rdata;

    const type = typeof rdata[0][sortColumn.toLowerCase()];

    items.sort(getComparator(type, sortColumn));

    return sortDirection === "ASC" ? items : items.reverse();
  }

  //  $: display = sortColumn && sortDirection ? sortData() : [...data];
  //  $: conds.page = pg - 1 ;
</script>

<div class="fitem pgset">
  <span class="number-in">
    Page :<input
      type="number"
      min="1"
      bind:value={pg}
      on:change={() => {
        conds.page = pg - 1;
      }}
    />
    Page크기 :<input type="number" min="1" bind:value={conds.psize} />
  </span>

  {#if rdata.length > conds.page}<button
      on:click={() => {
        conds.page++ ;
      }}
    >
      Next &gt;</button
    >
  {/if}
  {#if pg > 1}
    <button
      on:click={() => {
        conds.page-- ;
      }}
    >
      &lt; Prev
    </button>
  {/if}
</div>
<div class="fitem tbl" >
  <table style="overflow:scroll">
    <thead>
      <tr>
        {#each columns as column}
          <th>
            <!--        <Button {sortBy} {column} {sortColumn} {sortDirection} />  -->
            {column}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#await rdata}
        <p>...waiting</p>
      {:then rows}
        {#each rows as row (row.pkey)}
          <tr
            class={row.sflag}
            on:dblclick={() => {
              pid = row.pkey;
              vid = "block";
            }}
          >
            <td class="cmpid"><strong><em>{row.id}</em></strong></td>
            <td class="stime">{row.송신시간.substring(5, 21)}</td>
            <td class="elapsed">{Math.round(row.소요시간 * 1000) / 1000}</td>
            <td class="methos">{row.method === null ? '': row.method}</td>
            <td class="uri">{row.uri}</td>
            <td class="rcode">{row.status}</td>
            <td class="rlen">{row.수신크기.toLocaleString("ko-KR")}</td>
            <td class="rhead">{row.수신헤더 === null ? '':row.수신헤더}</td>
            <td class="tcode">{row.tid}</td>
          </tr>
        {/each}
      {:catch err}
        <p style="color: red">{err.message}</p>
      {/await}
    </tbody>
  </table>

</div>
<DetailTR bind:vid bind:pid />

<style>
  .elapsed {
    min-width: 5em;
  }
  .stime {
    min-width: 8em;
  }
  .rhead,
  .uri {
    text-align: left;
  }

  .pgset {
    display: flex;
    align-items: baseline;
  }
  .pgset * {
    margin: 2px 4px;
    padding: 2px 3px;
    height: 1.7rem;
  }
  .pgset button {
    width: 4em;
  }
  .number-in input {
    max-width: 60px;
    text-align: right;
  }

  .tbl {
    overflow: auto;
    height: 78vh ;
  }
  table {
    border-collapse : collapse;
    width: 100%;
    /* height: 100%; */
  }
  thead {
    max-height: 1.2em;
    position: sticky;
    top: 0px;
  }
  th {
    max-width: 20%;
    padding-left: 5px;
    text-align: center;
    border-right: 1px solid #f0f2fa;
  }

  td {
    max-width: 20%;
    margin: 0;
    padding: 0.5rem;
    vertical-align: top;
    text-align: inherit;
    font-size: 0.9rem;
    background-color: #ffffff;
    border-right: 1px solid #f0f2fa;
  }

  td, th {
    border: 1px solid rgb(214, 214, 230);
    padding: 5px;
  }

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

  tbody tr:hover td{
    background-color: #ddd;
  }
 
</style>
