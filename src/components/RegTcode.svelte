<script>
  import { onMount} from "svelte";
  import { gtcode} from "../aqtstore" ;
  import { getLvlnm, getLvls, getTypenm , getTypes} from "./Common.svelte";
  import Modal,{getModal} from './Modal.svelte';
  import CopyTr from "./CopyTr.svelte";

  let rdata = Promise.resolve([]);
  let tcode ;
  let jobnm = "등록" ;
  let copytr = "copytr" ;
  let curRow = {};
  
  let lvl, ttype, desc1, cmpCode ='', tdate, endDate, tdir=null, tuser=null, thost, tport, tenv='';
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
    "데이터건수",
  ];

  function updTcode() {
    
    fetch("/tmaster", {
      method: jobnm === "등록" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "code":curRow.code.toUpperCase() ,
        "lvl":curRow.lvl,
        "type":curRow.type,
        "desc1":curRow.desc1,
        "cmpCode":curRow.cmpCode,
        "tdate":curRow.tdate,
        "endDate":curRow.endDate,
        "thost":curRow.thost ?? '',
        "tport":curRow.tport ?? 0,
        "tenv":curRow.tenv ?? '',
        "tdir":curRow.tdir ?? '',
        "tuser":curRow.tuser ?? ''
      })
    }).then( async (res) => {
      let rmsg = await res.json();
      alert(rmsg.message );
      if ( res.status < 300 ) {
        getModal().close();
        getdata();
      }
    }).catch( (err) => {
      alert("error:"+ err.message);
    });
  }

  function eraseTr() {
    let codes = rdata.filter(r => r.chk ).map( r => r.code ) ;

    // console.log(codes);
    if (codes.length == 0)  return ;
    fetch("/tmaster/erasetr", {
      method: "PUT" ,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "codes":codes 
      })
    }).then( async res => {
      let rmsg = await res.json();
      if (res.status < 400) {
        alert("정상 삭제되었습니다 \n" + Object.entries( rmsg) );
        getdata();
      }
    }).catch( (err) => {
      throw err;
    });
  }

  function delTcode() {
    const delcodes = rdata.filter(r => r.chk ).map( r => r.code ) ;

    if (delcodes.length == 0)  return ;
    // console.log("del code:", delcodes) ;
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
      if (res.status < 400) {
        alert("정상 삭제되었습니다");
        getdata();
      }
    }).catch( (err) => {
      throw err;
    });
  }
  async function getdata() {
    const res = await fetch("/tmaster");
    if (res.status === 200) {
      rdata = await res.json();
    } else {
      throw new Error(res.statusText);
    }
  }

  onMount( getdata );

</script>
<div id="btns" style="display:flex; justify-content: flex-start; ">
  <button on:click={() => { jobnm = "등록", 
    curRow.code = "",curRow.type = "1",curRow.lvl = '1',
    curRow.endDate=null, curRow.cmpCode=null, curRow.tdate = (new Date).toISOString().slice(0,10) ; 
    getModal().open(undefined,'50','60') }}>신규등록</button>
  <button on:click={delTcode}>선택삭제</button>
  <button on:click={() => { gtcode.update(v => curRow.code) ; getModal(copytr).open(null,'60','60'); }}>전문생성</button>
  <button on:click={eraseTr}>전문삭제</button>
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
            on:click={() => curRow = row}
            on:dblclick={() => {
              // copyRow(row) ;
              curRow = row ;
              jobnm = "수정";
              getModal().open({},'50','60') ;
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
            <td class="cnt" style="text-align:right">{row.data_cnt.toLocaleString("ko-KR")}</td>
            {#if (curRow === row)}
            <td>◀</td>
            {/if}

          </tr>
        {/each}
      {:catch err}
        <p style="color: red">{err.message}</p>
      {/await}
    </tbody>
  </table>
</div>
<Modal>
    <h2>{ jobnm !="등록" ? curRow.code : ""} 테스트코드 {jobnm}</h2>
    <div class="items">
      <div class="item in_label">테스트코드:</div><div><input class="item in_value" pattern="[A-Z0-9]{3,6}" bind:value={curRow.code}></div>
      <div class="item in_label">테스트명:</div><div ><input class="item in_value" bind:value={curRow.desc1}></div>
      <div class="item in_label">타입:</div><div>
        <select  class="item in_value" bind:value={curRow.type} >
          {#each Object.entries(getTypes()) as [key, value], index (key)}
            <option value={key}>{value}</option>
          {/each}
        </select>
      </div>
      <div class="item in_label">단계:</div><div>
        <select class="item in_value" bind:value={curRow.lvl} >
          {#each Object.entries(getLvls()) as [key, value], index (key)}
            <option value={key}>{value}</option>
          {/each}
        </select>
      </div>
      <div class="item in_label">테스트시작일:</div><div><input class="item in_value" type="date" bind:value={curRow.tdate}></div>
      <div class="item in_label">대상서버:</div><div><input class="item in_value" bind:value={curRow.thost}></div>
      <div class="item in_label">대상Port:</div><div><input class="item in_value" type="number" min="2" max="65535" bind:value={curRow.tport}></div>
    </div>
    <hr>
    <div>
      <button on:click={updTcode}>저장</button>
      <button on:click={() => getModal().close() }>닫기</button>
    </div>
</Modal>
<Modal bind:id={copytr} >
  <CopyTr on:click={() => getModal(copytr).close() } />
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
    border: 1px solid silver;
    border-radius: 5px;
  }
  .in_label {
    text-align: end;
  }

  table {
	border-collapse: collapse;
	overflow: auto;
}

td, th {
    border: 1px solid rgb(214, 214, 230);
    padding: 5px;
}

td {
	overflow:hidden;
	white-space : wrap;
	text-overflow: clip;
	font-size: 0.9rem;
}

th {
	background-color: var(--th_bgcolor);
	color: var(--th_color);
}

/* tbody tr:nth-child(odd) td {
	background-color: #fafbff;
} */

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

tbody tr:hover {
	background-color: #ddd;
}

</style>