<script>
  import { onMount } from "svelte";
  import { getLvlnm, getLvls, getTypenm , getTypes} from "./Common.svelte";
  import Modal,{getModal} from './Modal.svelte';

  let rdata = Promise.resolve([]);
  let tcode ;
  let jobnm = "등록" ;

  let lvl, ttype, desc1, cmpCode, tdate, endDate, tdir, tuser, thost, tport, tenv;
  const columns = [
    " ",
    "테스트Id",
    "테스트명",
    "타입",
    "단계",
    "비교대상",
    "테스트시작일",
    "종료일",
    "대상서버",
    "대상Port",
  ];

  async function copyRow(row) {
    tcode = row.code ;
    lvl = row.lvl;
    ttype = row.type ;
    desc1 = row.desc1;
    cmpCode = row.cmpCode ;
    tdate = row.tdate ;
    endDate = row.endDate ;
    tdir = row.tdir ;
    tuser = row.tuser ;
    thost = row.thost ;
    tport = row.tport ;
    tenv = row.tenv ;
  }

  function updTcode() {
    fetch("/tmaster", {
      method: jobnm === "등록" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "code":tcode,
        "lvl":lvl,
        "type":ttype,
        "desc1":desc1,
        "cmpCode":cmpCode,
        "tdate":tdate,
        "endDate":endDate,
        "thost":thost,
        "tport":tport,
        "tenv":tenv,
        "tdir":tdir,
        "tuser":tuser
      })
    }).then( async (res) => {
      let rmsg = await res.json();
      alert("정상 처리되었습니다");
      getModal().close();
      getdata();
    }).catch( (err) => {
      throw err;
    });
  }

  function delTcode() {
    const delcodes = [] ;
    console.log("del call") ;
    rdata.forEach(r => { if (r.chk) delcodes.push(r.code) } ) ;
    console.log("del code:", delcodes) ;
    fetch("/tmaster", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "codes" : delcodes
      })
    }).then( async (res) => {
      let rmsg = await res.json();
      alert("정상 삭제되었습니다");
      getdata();
    }).catch( (err) => {
      throw err;
    });
  }
  async function getdata() {
    //    try {
      document.getElementById('modal').style.width = '50%' ;
    const res = await fetch("/tmaster");
    if (res.status === 200) {
      rdata = await res.json();
    } else {
      throw new Error(res.statusText);
    }
  }

  onMount(getdata);

</script>
<div id="btns" style="display:flex; justify-content: flex-start; ">
  <button on:click={() => { jobnm = "등록"; getModal().open() }}>신규등록</button>
  <button on:click={delTcode}>선택삭제</button>
  <button>전문생성</button>
</div>
<hr>
<div class="tmasterList">
  <table>
    <thead>
      <tr>
        {#each columns as column}
          <th>
            {column}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#await rdata}
        <p>...waiting</p>
      {:then rows}
        {#each rows as row (row.code)}
          <tr
            class={row.type}
            on:dblclick={() => {
              copyRow(row) ;
              jobnm = "수정";
              getModal().open() ;
            }}
          >
            <td><input type="checkbox" bind:checked={row.chk} /></td>
            <td class="tcode"><strong>{row.code}</strong></td>
            <td class="desc1" style="width:10rem">{row.desc1}</td>
            <td class="type">{getTypenm(row.type)}</td>
            <td class="lvl">{getLvlnm(row.lvl)}</td>
            <td class="cmpCode">{row.cmpCode}</td>
            <td class="tdate">{row.tdate}</td>
            <td class="endDate">{row.endDate === null ? "" : row.endDate}</td>
            <td class="thost">{row.thost}</td>
            <td class="tport">{row.tport}</td>
          </tr>
        {/each}
      {:catch err}
        <p style="color: red">{err.message}</p>
      {/await}
    </tbody>
  </table>
</div>
<Modal>
    <h2>{ jobnm !="등록" ? tcode : ""} 테스트코드 {jobnm}</h2>
    <div class="items">
      <div class="item in_label">테스트코드:</div><div><input class="item in_value" pattern="[A-Z0-9]{3,6}" bind:value={tcode}></div>
      <div class="item in_label">테스트명:</div><div ><input class="item in_value" bind:value={desc1}></div>
      <div class="item in_label">타입:</div><div>
        <select  class="item in_value" bind:value={ttype} >
          {#each Object.entries(getTypes()) as [key, value], index (key)}
            <option value={key}>{value}</option>
          {/each}
        </select>
      </div>
      <div class="item in_label">단계:</div><div>
        <select class="item in_value" bind:value={lvl} >
          {#each Object.entries(getLvls()) as [key, value], index (key)}
            <option value={key}>{value}</option>
          {/each}
        </select>
      </div>
      <div class="item in_label">테스트시작일:</div><div><input class="item in_value" type="date" bind:value={tdate}></div>
      <div class="item in_label">대상서버:</div><div><input class="item in_value" bind:value={thost}></div>
      <div class="item in_label">대상Port:</div><div><input class="item in_value" type="number" min="2" max="65535" bind:value={tport}></div>
    </div>
    <hr>
    <div>
      <button on:click={updTcode}>저장</button>
      <button on:click={() => getModal().close() }>닫기</button>
    </div>
</Modal>
<style>
  .items {
    display:grid;
    grid-template-columns: 8rem 1fr;
    gap: 10px 20px;
    align-content: start; 
  }

  .item {
    vertical-align: text-bottom ;
  }

  .in_value {
    border: 2px solid silver;
    border-radius: 5px;
  }
  .in_label {
    text-align: end;
  }

</style>