<script>
  import { onMount } from "svelte";
  import Modal, { getModal } from "./Modal.svelte";
  import CopyTr from "./CopyTr.svelte";

  const jobkindnm = {
    0: "패킷캡쳐",
    1: "import패킷",
    3: "전문생성",
    9: "테스트수행",
  };
  const statusnm = { 0: "미실행", 1: "실행중", 2: "작업완료", 3: "수행오류" };

  let rdata = Promise.resolve([]);
  let jobnm = "등록";
  let copytr = "copytr";
  let edited = false;

  let pkey,
    jobkind,
    tcode,
    tdesc,
    tnum,
    dbskip,
    etc,
    in_file,
    outlogdir,
    reqstartDt,
    exectype,
    resultstat,
    reqnum,
    repnum,
    startDt,
    endDt,
    msg;

  let curRow = {};

  const columns = [
    " ",
    "Job No",
    "작업종류",
    "테스트ID",
    "Description",
    "작업개수",
    "작업요청일시",
    "상태",
    "작업시작시간",
    "작업종료시간",
    "작업메세지",
  ];

  async function copyRow(row) {
    pkey = row.pkey;
    tcode = row.tcode;
    jobkind = row.jobkind;
    tdesc = row.tdesc;
    tnum = row.tnum;
    dbskip = row.dbskip;
    etc = row.etc;
    in_file = row.in_file;
    outlogdir = row.outlogdir;
    reqstartDt = row.reqstartDt;
    exectype = row.exectype;
    resultstat = row.resultstat;
    reqnum = row.reqnum;
    repnum = row.repnum;
    startDt = row.startDt;
    endDt = row.endDt;
    msg = row.msg;
  }

  function updTcode() {
    fetch("/texecjob", {
      method: jobnm === "등록" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pkey,
        jobkind,
        tcode,
        tdesc,
        tnum,
        dbskip,
        etc,
        in_file,
        outlogdir,
        reqstartDt,
        exectype,
        resultstat,
        reqnum,
        repnum,
        startDt,
        endDt,
        msg,
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

  function delTcode() {
    const delcodes = [];

    rdata.forEach((r) => {
      if (r.chk) delcodes.push(r.pkey);
    });
    if (delcodes.length == 0) return;
    console.log("del code:", delcodes);
    fetch("/texecjob", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codes: delcodes,
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
    const res = await fetch("/texecjob");
    if (res.status === 200) {
      rdata = await res.json();
    } else {
      throw new Error(res.statusText);
    }
  }

  onMount(getdata);
</script>

<div class="main">
  <div class="itemx"
    style="display:flex; justify-content: flex-start; align-items:baseline"
  >
    [전문송신이력]
    <fieldset style="display:flex; border: 1px solid silver;">
      <label class="rlabel"
        ><input type="radio" name="drone" value={0} />미실행Job</label>
      <label class="rlabel"
        ><input type="radio" name="drone" value={1} />실행중</label>
      <label class="rlabel"
        ><input type="radio" name="drone" value={2} />작업완료</label>
      <label class="rlabel"
        ><input type="radio" name="drone" value={4} checked />모두보기</label>
    </fieldset>
  </div>
  <hr />
  <div class="itemx texecList">
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
              class={row.resultstat}
              on:click={() => {
                curRow = row;
              }}
            >
              <td><input type="checkbox" bind:checked={row.chk} /></td>
              <td class="pkey"><strong>{row.pkey}</strong></td>
              <td class="jobkind">{jobkindnm[row.jobkind]}</td>
              <td class="tcode">{row.tcode}</td>
              <td class="tdesc" style="width:10rem">{row.tdesc}</td>
              <td class="tnum">{row.tnum}</td>
              <td class="reqstartDt">{row.reqstartDt}</td>
              <td class="resultstat">{statusnm[row.resultstat]}</td>
              <td class="startDt">{row.startDt}</td>
              <td class="endDt">{row.endDt}</td>
              <td class="msg" style="width:150px">{row.msg ? row.msg.split("\n")[0] :""}</td>
            </tr>
          {/each}
        {:catch err}
          <p style="color: red">{err.message}</p>
        {/await}
      </tbody>
    </table>
  </div>
  <div class="itemx" style="display:flex; justify-content: flex-start; ">
    <button
      on:click={() => {
        jobnm = "등록";
      }}>신규등록</button
    >
    <button disabled={edited} on:click={updTcode}>저장</button>
    <button on:click={getModal(copytr).open({}, "60", "60")}>전문생성</button>
  </div>

  <div class="itemx">
    <div class="items">
      <div class="item in_label">테스트ID:</div>
        <input class="item in_value" maxlength=10 style="width:200px"
          pattern="[A-Z0-9]{(3, 6)}"
          bind:value={curRow.tcode}
        />
      <div class="item in_label">Description:</div>
      <input class="item in_value" bind:value={curRow.tdesc} />
      <div class="item in_label">작업종류:</div>
      <fieldset style="display:flex; border: 1px solid silver;">
        <label><input type="radio" name="kind" value={9} bind:group={curRow.jobkind}>테스트수행</label>
        <label><input type="radio" name="kind" value={1} bind:group={curRow.jobkind}>import패킷</label>
        <label><input type="radio" name="kind" value={3} bind:group={curRow.jobkind}>전문생성</label>
      </fieldset>
      <div class="item in_label">작업요청일시:</div>
      <input class="item in_value" type="datetime-local" bind:value={curRow.reqstartDt} />
      <div class="item in_label">작업개수:</div>
      <input class="item in_value" type="number" bind:value={curRow.tnum} />
      <div class="item in_label">송신간격:</div>
      <input class="item in_value" type="number" bind:value={curRow.reqnum} />
      <div class="item in_label">작업메세지:</div>
      <textarea readonly class="item in_value" bind:value={curRow.msg} ></textarea>
    </div>
  </div>
</div>
<Modal bind:id={copytr}>
  <CopyTr on:click={() => getModal(copytr).close()} />
</Modal>

<style>
  .main {
    max-height: 100%;
    overflow: auto;
  }
  .texecList {
    max-height: 50vh;
    overflow: auto;
  }

  .itemx:nth-child(3) {
    flex: 1 0 40vh;
  }
  fieldset>label {
    padding: 0px 5px;
  }
  .items {
    display: grid;
    grid-template-columns: 6rem auto 8rem 1fr;
    gap: 5px 20px;
    align-content: start;
    margin: 20px;
  }

  .item {
    vertical-align: text-bottom;
  }

  .in_value:not(textarea) {
    border: 1px solid silver;
    border-radius: 5px;
    height: 2em;
  }
  .in_label {
    text-align: end;
  }

  textarea { height: 100px; font-size: 0.8em;}

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
    position: sticky;
    top: 0;
  }

  tbody tr:nth-child(odd) td {
    background-color: #fafbff;
  }

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
