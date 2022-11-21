<script>
  import { onMount } from "svelte";
  import { getLvlnm, getLvls, getTypenm , getTypes} from "./Common.svelte";
  let rdata = Promise.resolve([]);
  let tcode ;
  let selected, answer ;

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

  async function addTcode() {
    const res = await fetch("/tmaster", {
      method: "POST",
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
      }),
    });
    if (res.ok) {
      let rmsg = await res.json();
      alert(rmsg) ;
    } else {
      throw new Error(res);
    }
  }

  async function getdata() {
    //    try {
    const res = await fetch("/tmaster");
    if (res.status === 200) {
      rdata = await res.json();
    } else {
      throw new Error(res.statusText);
    }
  }

  onMount(getdata);
</script>
<div id="btns">
  <button>신규등록</button>
  <button>선택삭제</button>
  <button>전문생성</button>
</div>
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
<div class="mymodal">
  <form on:submit|preventDefault={addTcode}>
    <p>테스트코드 등록</p>
    <div class="items">
      <div class="item in_label">테스트코드:</div><div class="item in_value"><input bind:value={tcode}></div>
      <div class="item in_label">테스트명:</div><div class="item in_value"><input bind:value={desc1}></div>
      <div class="item in_label">타입:</div><div class="item in_value">
        <select bind:value={ttype} >
          {#each Object.entries(getTypes()) as [key, value], index (key)}
            <option value={key}>{value}</option>
          {/each}
        </select>
      </div>
      <div class="item in_label">단계:</div><div class="item in_value">
        <select bind:value={lvl} >
          {#each Object.entries(getLvls()) as [key, value], index (key)}
            <option value={key}>{value}</option>
          {/each}
        </select>
      </div>
      <div class="item in_label">테스트시작일:</div><div class="item in_value"><input type="date" bind:value={tdate}></div>
      <div><button>저장</button></div>
    </div>
  </form>
</div>
<style>
  .items {
    display:flex;
    flex-wrap: wrap;
    width:60% ;
  }
  .item {
    flex: 1 0 40%;
  }

  .mymodal {
    width:60% ;
  }
</style>