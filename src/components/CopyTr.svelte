
<script>
  import { onMount } from "svelte";

  let tlist_org = [];
  let tlist = [];
  let flag_s = true ;
  let flag_f = true ;
  let conds = {
    srccode: "",
    dstcode: "",
    uri: "",
    cnt: 0,
    cond: ""
  };

  function createTr() {

  }

  onMount(async () => {
    const res = await fetch( "/tmaster/tsellist" ) ;
    tlist = await res.json(); 
    conds.dstcode = tlist[0];
    const reso = await fetch( "/tmaster/torglist" ) ;
    tlist_org = await reso.json(); 
    tlist_org.push({code:'%',name:'ALL'});
    conds.srccode = tlist_org[0];

  });

</script>


<h2>테스트데이터 생성</h2>
<div class="items">
  <div class="item">
    <div class="in_label">원본:</div><div>
      <select  class="in_value" bind:value={conds.srccode} >
        {#each Object.entries(tlist_org) as [key, value], index (key)}
          <option value={key}>{key + ' : ' + value}</option>
        {/each}
      </select>
    </div>
    <div class="in_label">대상:</div><div>
      <select  class="in_value" bind:value={conds.dstcode} >
        {#each Object.entries(tlist) as [key, value], index (key)}
          <option value={key}>{key + ' : ' + value}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="item in_label">URI or 서비스:</div><div><input class="item in_value" type="date" bind:value={conds.uri}></div>
  <div class="item in_label">서비스별 건수:</div><div><input class="item in_value" type="number" bind:value={conds.cnt}></div>
  <div class="item in_label">기타조건:</div><div><input class="item in_value" bind:value={conds.cond}></div>
</div>
<hr>
<div>
  <button on:click={createTr}>데이터생성</button>
  <button on:click={() => getModal().close() }>닫기</button>
</div>
