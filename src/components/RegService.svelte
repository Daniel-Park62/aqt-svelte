<script>
  import { onMount } from "svelte";
  import { gtcode } from "../aqtstore";
  import { getLvlnm, getLvls, getTypenm, getTypes } from "./Common.svelte";
  import Modal, { getModal } from "./Modal.svelte";

  let rdata = Promise.resolve([]);
  let tcode;
  let jobnm = "등록";
  let copytr = "copytr";
  let curRow = {};

  let pkey, svcid, appid, svckor, svceng, svckind, task, manager;
  const columns = [
    " ",
    "APP ",
    "서비스(URI)",
    "서비스명(한글)",
    "서비스명(영문)",
    "업무명",
    "담당자",
    "서비스종류",
  ];

  function updService() {
    console.log( rdata.filter((r) => ( r[0] && r[1] != 0) ) ) ;
    const upds = rdata.filter((r) => ( r[0] && r[1] != 0) ).map((r) => r.slice(1));
    const inss = rdata.filter((r) => ( r[0] && r[1] == 0) ).map((r) => r.slice(2));
    console.log(upds) ;
    fetch("/tservice", {
      method: "POST" ,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        upd: upds,
        ins: inss
      }),
    })
      .then(async (res) => {
        let rmsg = await res.json();
        alert(rmsg.message);
        if (res.status < 300) {
          getdata();
        }
      })
      .catch((err) => {
        alert("error:" + err.message);
      });
  }

  function delService() {
    const delcodes = rdata.filter((r) => r[0]).map((r) => r[1]);

    if (delcodes.length == 0) return;
    // console.log("del code:", delcodes) ;
    fetch("/tservice", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pkeys: delcodes,
      }),
    })
      .then(async (res) => {
        let rmsg = await res.json();
        if (res.status < 400) {
          alert("정상 삭제되었습니다");
          getdata();
        }
      })
      .catch((err) => {
        throw err;
      });
  }
  async function getdata() {
    const res = await fetch("/tservice");
    if (res.status === 200) {
      rdata = await res.json();
    } else {
      throw new Error(res.statusText);
    }
  }

  onMount(getdata);
</script>

<div id="btns" style="display:flex; justify-content: flex-start; ">
  <button on:click={updService}>적용</button>
  <button on:click={delService}>선택삭제</button>
</div>
<hr />
<div class="tList">
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
        {#each rows as row (row[1])}
          <tr
            on:click={() => (curRow = row)}
          >
            <td><input type="checkbox" bind:checked={row[0]} /></td>
            <td class="appid" >{row[2]}</td>
            <td class="svcid" style="width:20rem">{row[3]}</td>
            <td
              contenteditable="true"
              class="svckor"
              style="width:20%"
              bind:textContent={row[4]}/>
            <td contenteditable="true" bind:textContent={row[5]} class="svceng" style="width:20%" />
            <td contenteditable="true" class="task" bind:textContent={row[6]}/>
            <td contenteditable="true" class="manager" bind:textContent={row[7]}/>
            <td contenteditable="true" class="svckind" bind:textContent={row[8]} />
            {#if curRow === row}
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

<style>
  .tList {
    max-height: 90vh;
    overflow: auto;
  }
  table {
    border-collapse: collapse;
    overflow: auto;
  }

  td,
  th {
    border: 1px solid rgb(214, 214, 230);
    padding: 5px;
  }

  td {
    overflow: hidden;
    white-space: wrap;
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
  .tList th {
    text-align: center;
    position: sticky;
    top: 0;
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

  .svcid, .svckor, .svceng {
    word-break:break-all;
  }
</style>
