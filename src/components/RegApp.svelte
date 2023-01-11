<script>
  import { onMount } from "svelte";

  let columns = ["APPID", "APP명", "담당자"];
  let columns_dtl = ["APPID", "Host IP", "0"];
  let data = [];
  let datadtl = [];
  let newRow = [...columns];
  let newRow_dtl = [...columns_dtl];

  let promise = Promise.resolve([]);
  let promise_dtl = Promise.resolve([]); 
  let appid = "";

  function addRow() {
    data = [...data, [...newRow]];
    newRow = columns;
  }
  function addRow_dtl() {
    datadtl = [...datadtl, [...newRow_dtl] ];
    newRow_dtl = columns_dtl;
  }

  function deleteRow(rowToBeDeleted) {
    data = data.filter((row) => row != rowToBeDeleted);
  }
  function deleteRow_dtl(rowToBeDeleted) {
    datadtl = datadtl.filter((row) => row != rowToBeDeleted);
  }
  
   async function getApphost(appid) {
    if (appid > '') {
      const res = await fetch("/regapp/host/" + appid) ;
      datadtl = await res.json() ; 
    } else {
      datadtl = Promise.resolve([]); 
    }
    return datadtl ;
  }

  $: promise = data ;
  $: promise_dtl = getApphost(appid) ;

  onMount(async () => {
    const res = await fetch("/regapp");
    
    data = await res.json();
    // promise = Promise.resolve(data);

  });

</script>

<div class="container">
  <table class="app-tbl item">
    <thead>
    <tr>
      <th>APP id</th>
      <th>APP 명</th>
      <th>담당자</th>
      <th style="width:4rem">삭제</th>
    </tr>
  </thead>
    {#await promise}
      <p>...waiting</p>
    {:then rows}
      {#each rows as row}
        <tr on:click={ () => appid = row[0]}>
          {#each row as cell}
            <td contenteditable="true" bind:innerHTML={cell} />
          {/each}
          <td><button on:click={() => deleteRow(row)}>X</button></td>
        </tr>
      {/each}
    {/await}
    <tr style="color: grey">
      {#each newRow as column}
        <td contenteditable="true" bind:innerHTML={column} />
      {/each}
      <td><button on:click={addRow}>add</button></td>
    </tr>
    <!-- <pre style="background: #eee">{JSON.stringify(data, null, 2)}</pre> -->
  </table>
  <table class="apphost item">
    <thead>
    <tr>
      <th>APP ID</th>
      <th>Host IP</th>
      <th>Port</th>
      <th style="width:4rem">삭제</th>
    </tr>
  </thead>
    {#await promise_dtl}
      <p>searching...</p>
    {:then rows} 
      
      {#each rows as row}
        <tr>
          {#each row as cell, i}
            {#if i != 0}
              <td contenteditable="true" bind:innerHTML={cell} />
            {:else}
              <td contenteditable="false" bind:innerHTML={cell} />
            {/if}
          {/each}
          <td><button on:click={() => deleteRow_dtl(row)}>X</button></td>
        </tr>
      {/each}
    {:catch error}
    <p>{error.message}</p>
     {/await}
      <tr style="color: grey">
      {#each newRow_dtl as col}
        <td contenteditable="true" bind:innerHTML={col} />
      {/each}
      <td><button on:click="{addRow_dtl}">add</button></td>
    </tr>
  </table>
</div>

<style>
  .container {
    display: flex;
  }
  .app-tbl {
    flex: 1 1 0;
  }
  .apphost {
    flex: 1 1 0;
    margin: 0 0 auto 5px;
  }
  .app-tbl,
  .apphost {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
  }

  .item {
    border-collapse: collapse;
    height: auto;
  }

  td,
  th {
    border: 1px solid rgb(214, 214, 230);
    padding: 5px;
  }

  th {
    padding: 8px;
    text-align: center;
    position: sticky;
    top: 0;
  }
  td button {
    font-size: 0.7em;
  }
  /* app-tbl tr:nth-child(even) {
    background-color: #f2f2f2;
  } */

  tr:hover {
    background-color: #ddd;
  }

  tr td:focus {
    background: #eee;
  }

  [contenteditable] {
    outline-style: none;
  }
</style>
