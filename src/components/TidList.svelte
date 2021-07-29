<script>
  import { onMount } from "svelte";
  import { getLvlnm} from "./Common.svelte";
  import Trtable from "./Trtable.svelte";
  import Modal,{getModal} from './Modal.svelte';

  export let tcode = "";
  let conds = {
    tcode: "%",
    rcode: '',
    page: 0,
    psize: 20,
    cond: "",
    uri: ""
  };

  let promise = Promise.resolve([]);
  onMount(async () => {
    const res = await fetch( "/dashboard");
    promise = await res.json();
  });
  $: conds.tcode = tcode ;
</script>

<div class="container">
  <table class="tcode-status">
    <thead>
      <tr>
        <th>테스트ID</th>
        <th>테스트명</th>
        <th style="width:6em">테스트일자</th>
        <th>단계</th>
        <th>대상호스트</th>
        <th>서비스수</th>
        <th>패킷건수</th>
        <th>성공건수</th>
        <th>실패건수</th>
        <th>실패서비스</th>
        <th>성공율(%)</th>
        <th>미수행건수</th>
      </tr>
    </thead>
    <tbody>
      {#await promise}
        <p>...waiting</p>
      {:then rows}
        {#each rows as row}
          <tr on:click={() => tcode = row.code } on:dblclick={()=> { conds.page=0;conds.cond = ''; getModal().open()}} >
            <td>{row.code}</td>
            <td>{row.desc1}</td>
            <td>{row.tdate}</td>
            <td>{getLvlnm(row.lvl)}</td>
            <td>{row.thost}</td>
            <td>{row.svc_cnt}</td>
            <td>{row.data_cnt.toLocaleString("ko-KR")}</td>
            <td>{row.scnt.toLocaleString("ko-KR")}</td>
            <td on:dblclick={()=> { conds.page=0;conds.cond = "sflag='2'"; getModal().open()}} >{row.fcnt.toLocaleString("ko-KR")}</td>
            <td>{row.fsvc_cnt}</td>
            <td>{row.spct.toFixed(2)}</td>
            <td>{row.data_cnt - row.scnt - row.fcnt}</td>
          </tr>
        {/each}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    </tbody>
  </table>
</div>
<Modal>
	<Trtable bind:conds />
</Modal>

<style>
  /* .title {
    text-align: justify;
  } */

  /* .container {
    height: auto;
    overflow: auto;
  } */
  .tcode-status {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  .tcode-status td,
  .tcode-status th {
    border: 1px solid rgb(214, 214, 230);
    padding: 5px;
  }

  .tcode-status th {
    text-align: center;
    position: sticky;
    top: 0;
  }

  /* .tcode-status tr:nth-child(even) {
    background-color: #f2f2f2;
  } */

  .tcode-status tr:hover {
    background-color: #ddd;
  }
</style>
