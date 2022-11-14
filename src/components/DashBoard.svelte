<script>
  import { onMount, afterUpdate } from "svelte";
  import TidList from "./TidList.svelte";
  
  let tcode ;
  let svccnt = 999;
  let datas = {svccnt:0, rows:[{lvl:'1'},{lvl:'2'}]};
  async function getdata() {
//    try { 
     const res = await fetch("/dashboard/summary") ;
     if (res.status === 200) {
       datas = await res.json();
     } else {
       throw new Error(res.statusText);
     }
  //  } catch (e) {
  //    console.log("call /dashboard/summary error", e) ;
  //  }

  }
  
  onMount( getdata );

</script>

<div class="main"  on:click={getdata}>
  <div class="container">
      
    <div class="subm">
      <div class="cap">단위테스트</div>
      <div class="items">
        <div class="item1 item">
          <div>전체누적진척율</div>
          <div class="per">{(datas.rows[0].svc_cnt * 100 / datas.svccnt).toFixed(2) }%</div>
          <span class="lbl">대상서비스 :</span><span>{datas.svccnt.toLocaleString("ko-KR")}</span><br>
          <span class="lbl">진행건수   :</span><span>{(datas.rows[0].svc_cnt *1).toLocaleString("ko-KR")}</span>
        </div>

        <div class="item2 item">
          <div>최신테스트현황</div>
          <div class="per">{(datas.rows[0].scnt * 100 / datas.rows[0].data_cnt).toFixed(2)  }%</div>
          <span class="lbl">수행건수 :</span><span>{( datas.rows[0].data_cnt * 1).toLocaleString("ko-KR") }</span><br>
          <span class="lbl">성공건수 :</span><span>{(datas.rows[0].scnt * 1).toLocaleString("ko-KR")}</span>
        </div>
      </div> 
    </div>
    <div class="subm">
      <div class="cap" >통합테스트</div>
      <div class="items">
        <div class="item1 item">
          <div>전체누적진척율</div>
          <div class="per">{(datas.rows[1].svc_cnt * 100 / datas.svccnt).toFixed(2) }%</div>
          <span class="lbl">대상서비스 :</span><span>{datas.svccnt.toLocaleString("ko-KR")}</span><br>
          <span class="lbl">진행건수   :</span><span>{(datas.rows[1].svc_cnt *1).toLocaleString("ko-KR")}</span>
        </div>

        <div class="item2 item">
          <div>최신테스트현황</div>
          <div class="per">{(datas.rows[1].scnt * 100 / datas.rows[1].data_cnt).toFixed(2) }%</div>
          <span class="lbl">수행건수 :</span><span>{( datas.rows[1].data_cnt * 1).toLocaleString("ko-KR") }</span><br>
          <span class="lbl">성공건수 :</span><span>{(datas.rows[1].scnt * 1).toLocaleString("ko-KR")}</span>
        </div>
      </div> 
    </div>
  </div>
</div>
<div class="tlist"><TidList bind:tcode /></div>

<style>
  .container, .items {
    display: flex;
    margin: 0%;
    height: auto;
    justify-content: space-evenly;
  }

  .subm {
    flex: 1 1 0;
    padding: 1em;
    text-align: left;
    color: #3455a3 ;
  }
  .subm > .cap{
    padding: 0 2em;
    color : silver ;
    font-weight: bold ;
    font-size: 1.4rem;
  }

  .item {
    border: solid 1px darkblue;
    box-shadow: 3px 3px 5px #8585a8;
    border-radius: 6px;
    flex: 1 1 0;
    max-width: 11em;
    margin: 0 1em;
    padding: 0.3em 2em;
    font-size: 1.2rem;
    text-align: center;
  }
  .item .per {
    font-size: 1.5rem;
    font-weight: bold ;
    color : #6A40FF ;
  }
  .item2 .per {
    color: #e19ae1;
  }
  .item span {
    display: inline-block ;
    text-align: right;
    width:4rem ;
    font-size: 1rem;
  }
  .item .lbl {
    width:6rem;
  }

</style>
