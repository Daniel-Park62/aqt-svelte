<script>
  import { onMount } from "svelte";
//   import { getComparator, formatDate, formatDateTime } from "../helpers.js";
// import { bind } from "svelte/internal";
// import DetailTr from "./DetailTR.svelte";
import Trtable from "./Trtable.svelte";

  let vid = 'none';
  let pid ;
  
  let conds = {
    tcode: "",
    rcode: '',
    page: 0,
    psize: 20,
    cond: "",
    uri: "",
    task:""
  };

  let tcodelist = [];
  let selected ;

  async function getTRlistm() {
    conds.tcode = selected.code ;
  }

  onMount(async () => {
    const res = await fetch( "/tmaster/tsellist" ) ;
    tcodelist = await res.json(); 
    tcodelist.push({code:'%',name:'ALL'});
    selected = tcodelist[0];
    // promise = Promise.resolve(tcodelist) ;
  });
  
</script>

<div class="main" on:mouseenter={() => vid = 'none' }>
  <div class="cond fitem">
    <p>* 테스트ID : </p> 
    <select bind:value={selected} >
        
      {#each tcodelist as tc}
      <option value={tc}>
        {tc.code + ' : ' + tc.name}
      </option>
      {/each}
    </select>
    <span>URI : <input type="text" bind:value={conds.uri} /></span>
    <span class="number-in">응답코드 : <input  type="number" bind:value={conds.rcode} /></span>
    <span>기타 : <input type="text" bind:value={conds.cond} /></span>
    <button on:click={getTRlistm}>조회</button>

  </div>
  <div class="fitem">
    <Trtable bind:conds/>
  </div>
</div>

<style>
  .main {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .cond {
    display:flex ;
    align-items: baseline ;
    
  }
  .cond * {
    margin: 2px 4px;
    padding: 0 3px;
    height: 1.7em;
  }
  .cond span {
    margin: 2px 8px;
  }  
  .cond button {
    width: 4em;
    border-radius: 6px;
  }
  .number-in input{
    max-width: 70px;
    text-align: right;
  }

</style>
