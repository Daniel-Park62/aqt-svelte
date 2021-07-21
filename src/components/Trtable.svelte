<script>
  import { getComparator, formatDate, formatDateTime } from "../helpers.js";
  import Button from "./Button.svelte";

  const columns = ['ID','송신시간','수신시간','소요시간','Method','URI','응답코드','수신크기','응답헤더','테스트ID'];

  export let conds = {
    tcode: "%",
    page: 0,
    psize: 20,
    cond: "1=1",
  };
  let data ;
  let sortColumn = null;
  let sortDirection = null;

  $: getTRlist(conds) ;

  async function getTRlist() {
    console.log(location.host, conds);
    const res = await fetch("http://" + location.host + "/trlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conds),
    });
    if (!res.ok) {
      console.log(res.statusText);
    }
    data = await res.json();

    console.log(data[0]) ;
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
</script>

<style>
  table {
    width: 100%;
    min-width: 900px;
    border-spacing: 0;
    position: relative;
    overflow: auto;
    margin-bottom: 0.5rem;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
  }

  thead {
    height: 1.2rem;
  }
  th {
    padding: 1.5rem 1.25rem;
    background-color: #ffffff;
    border-bottom: 1px solid #f0f2fa;
    position: sticky;
    top: 0;
  }

  th:first-child {
    left: 0;
    z-index: 1;
    border-right: 1px solid #f0f2fa;
  }

  td {
    margin: 0;
    padding: 1.25rem;
    vertical-align: top;
    text-align: inherit;
    font-size: 0.9rem;
    max-width: 20%;
    background-color: #ffffff;
  }

  td:first-child {
    position: sticky;
    left: 0;
    top: auto;
    width: 6rem;
    border-right: 1px solid #f0f2fa;
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

  /* svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.25rem;
    fill: rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
  } */

  .flex {
    display: flex;
    align-items: center;
  }
</style>

<table>
  <thead>
    <tr>
      {#each columns as column}
        <th>
          {column}
          <!-- <Button {sortBy} {column} {sortColumn} {sortDirection} /> -->
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#await data then dt}
    {#each dt as row}
      <tr class="{row.sflag}">
        <td class="cmpid"><strong><em>#{row.cmpid}</em></strong></td>
        <td class="stime">formatDateTime({row.stime})</td>
        <td class="rtime">formatDateTime({row.rtime})</td>
        <td class="elapsed">{row.elapsed}</td>
        <td class="methos">{row.method}</td>
        <td class="uri">{row.uri}</td>
        <td class="rcode">{row.method}</td>
        <td class="rlen">{row.rlen.toLocaleString("ko-KR")}</td>
        <td class="rhead">{row.rhead}</td>
        <td class="tcode">{row.tcode}</td>
      </tr>
    {/each}
    {/await}
  </tbody>
</table>