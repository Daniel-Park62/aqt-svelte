<script>
  import { onMount } from "svelte";

  const lvlnm = { 0: "Origin", 1: "단위", 2: "통합", 3: "실시간" };
  export let tcode = "";

  let promise = Promise.resolve([]);
  onMount(async () => {
    const res = await fetch( "/dashboard");
    promise = await res.json();
  });

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
          <tr on:click={() => tcode = row.code } >
            <td>{row.code}</td>
            <td>{row.desc1}</td>
            <td>{row.tdate}</td>
            <td>{lvlnm[row.lvl]}</td>
            <td>{row.thost}</td>
            <td>{row.svc_cnt}</td>
            <td>{row.data_cnt.toLocaleString("ko-KR")}</td>
            <td>{row.scnt.toLocaleString("ko-KR")}</td>
            <td>{row.fcnt.toLocaleString("ko-KR")}</td>
            <td>{row.fsvc_cnt}</td>
            <td>{Math.trunc(row.spct * 100) / 100}</td>
            <td>{row.data_cnt - row.scnt - row.fcnt}</td>
          </tr>
        {/each}
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    </tbody>
  </table>
</div>

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
