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
    "APP ID",
    "서비스(URI)",
    "서비스명(한글)",
    "서비스명(영문)",
    "업무명",
    "담당자",
    "서비스종류",
  ];

  function updService() {
    fetch("/tservice", {
      method: jobnm === "등록" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [1, 2, 3],
          [66, 77, 88],
        ],
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
    const delcodes = rdata.filter((r) => r.chk).map((r) => r.pkey);

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
        {#each rows as row (row.pkey)}
          <tr
            on:click={() => (curRow = row)}
            on:dblclick={() => {
              // copyRow(row) ;
              curRow = row;
              jobnm = "수정";
            }}
          >
            <td><input type="checkbox" bind:checked={row.chk} /></td>
            <td class="appid">{row.appid}</td>
            <td class="svcid">{row.svcid}</td>
            <td
              contenteditable="true"
              class="svckor"
              style="width:10rem"
              bind:textContent={row.svckor}>{row.svckor}</td
            >
            <td contenteditable="true" class="svceng" style="width:10rem"
              >{row.svceng}</td
            >
            <td contenteditable="true" class="task">{row.task}</td>
            <td contenteditable="true" class="manager">{row.manager}</td>
            <td contenteditable="true" class="svckind">{row.svckind}</td>
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
