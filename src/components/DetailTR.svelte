<script>
  import { onMount } from "svelte";

  export let vid = "none";
  export let pid = 0;

  let modal;
  let cdata ;
  let odata = {ok: false , display: 'none'};

  $: if (modal) modal.style.display = vid;
  $: cdata = getDetail(pid);

  async function getDetail(pid) {
    const res = await fetch("http://" + location.host + "/trlist/" + pid);
    return await res.json();
  }

  async function getNext(pid) {
    const res = await fetch("http://" + location.host + "/trlist/next/" + pid);
    if (res.ok) cdata = await res.json();
    else {
      const err = await res.json();
      window.alert(err.message);
    }
    odata.ok = false ;
    if (document.getElementById("odata").style.display == 'block') getOrig(cdata[0].cmpid) ;

  }

  async function getPrev(pid) {
    const res = await fetch("http://" + location.host + "/trlist/prev/" + pid);
    if (res.ok) cdata = await res.json();
    else {
      const err = await res.json();
      window.alert(err.message);
    }
    odata.ok = false ;
    if (document.getElementById("odata").style.display == 'block') getOrig(cdata[0].cmpid) ;
  }

  function closedtl() {
    vid = "none";
  }

  async function viewOrig(pid) {
    if (odata.display == 'none') {
      odata.display = 'block' ;
      getOrig(pid);
    } else {
      odata.display = 'none' ;
    }
    document.getElementById("odata").style.display = odata.display ;
  }

  async function getOrig(pid) {

    let rows ;
    if (! odata.ok) {
      const res = await fetch("http://" + location.host + "/trlist/orig/" + pid + '/');
      if (res.ok) rows = await res.json();
      else {
        const err = await res.json();
        window.alert(err.message);
        return ;
      }
      odata.ok = true ;
      for (let row of rows) {
        odata.row = row ;
      }
    }

  }

  window.onclick = function (event) {
    modal = document.getElementById("myModal");
    if (event.target == modal) {
      vid = "none";
    }
  };
</script>

<!-- The Modal -->
<div id="myModal" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
    {#await cdata then rows}
      {#if rows.length > 0}
        <div class="ny1">
          <span class="title">{" ??????ID : " + rows[0].cmpid} </span>
          <nav>
            <button on:click={async () => getNext(rows[0].pkey)}>??????</button>
            <button on:click={async () => getPrev(rows[0].pkey)}>??????</button>
            <button on:click={async () => { viewOrig(rows[0].cmpid)} }>????????????</button>
            <button on:click={closedtl}>Close</button>
          </nav>
        </div>

        <div class='data'>
          {#each rows as row}
        <div class='cdata'>
        <div class="ny2">
          <table>
            <tr>
              <td class="lbl">?????????ID</td><td>{row.tcode}</td>
              <td class="lbl">ID</td><td>{row.pkey}</td>
              <td class="lbl">Source</td><td>{row.srcip + ":" + row.srcport}</td>
            </tr>
            <tr>
              <td class="lbl">?????????</td><td>{row.stime + ' ~ ' + row.rtime.substring(11)}</td>
              <td class="lbl">????????????</td><td>{row.svctime}</td>
              <td class="lbl">Destination</td><td>{row.dstip + ":" + row.dstport}</td>
            </tr>
            <!-- <tr>
              <td class="lbl">URI</td><td colspan="3">{row.uri}</td>
              <td class="lbl">Method</td><td>{row.method}</td>
              <td class="lbl">????????????</td><td>{row.cdate}</td>
              <td class="lbl">????????????</td><td>{row.rcode}</td>
            </tr> -->
          </table>
        </div>
        <div class="ny3">
          <br /><span
            >{"??????????????? : " + row.slen.toLocaleString("ko-KR")}
          </span> <br />
          <textarea readonly rows="8" cols="120">{row.sdata}</textarea>
        </div>
        <div class="ny3">
          <span>????????????</span> <br />
          <textarea readonly rows="8">{row.rhead}</textarea>
        </div>
        <div class="ny3">
          <span>{"??????????????? : " + row.rlen.toLocaleString("ko-KR")}</span><br
          />
          <textarea readonly rows="8" cols="120">{row.rdata}</textarea>
        </div>
      </div>
      {/each}
      <div id="odata" >
        {#if odata.ok }
        <div class="ny2">
          <table>
            <tr>
              <td class="lbl">?????????ID</td><td>{odata.row.tcode}</td>
              <td class="lbl">ID</td><td>{odata.row.pkey}</td>
              <td class="lbl">Source</td><td>{odata.row.srcip + ":" + odata.row.srcport}</td>
            </tr>
            <tr>
              <td class="lbl">?????????</td><td>{odata.row.stime + ' ~ ' + odata.row.rtime.substring(11)}</td>
              <td class="lbl">????????????</td><td>{odata.row.svctime}</td>
              <td class="lbl">Destination</td><td>{odata.row.dstip + ":" + odata.row.dstport}</td>
            </tr>
          </table>
        </div>
        <div class="ny3">
          <br /><span
            >{"??????????????? : " + odata.row.slen.toLocaleString("ko-KR")}
          </span> <br />
          <textarea readonly rows="8" cols="120">{odata.row.sdata}</textarea>
        </div>
        <div class="ny3">
          <span>????????????</span> <br />
          <textarea readonly rows="8">{odata.row.rhead}</textarea>
        </div>
        <div class="ny3">
          <span>{"??????????????? : " + odata.row.rlen.toLocaleString("ko-KR")}</span><br
          />
          <textarea readonly rows="8" cols="120">{odata.row.rdata}</textarea>
        </div>        
        {/if}
      </div>
      </div>
      {/if}
    {/await}
  </div>
</div>

<style>
  /* The Modal (background) */
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #e1e6f6;
    margin: 0% auto; /* 15% from the top and centered */
    padding: 15px;
    border: 1px solid #888;
    width: 90%;
  }

  .data {
    display: flex ;
  }
  .cdata, #odata{
    flex: 1 1 0 ;
  }
  #odata {
    border-left: 2px solid darkblue;
    display : none;
  }
  /* .modal-content > div  {
    width : 95%;
    padding-left : 1em ;
  } */
  .modal-content table {
    border-collapse: collapse;
    width: 100%;
    height: auto;
  }
  .modal-content td {
    margin: 0;
    padding: 0.5rem;
    vertical-align: middle;
    text-align: left;
    /* font-size: 0.9rem; */
    max-width: 20%;
    background-color: #ffffff;
    border: 1px solid #8d95b6;
  }
  td.lbl {
    background-color: var(--th_bgcolor);
    color: var(--th_color);
    text-align: center;
  }

  .ny1 {
    box-shadow: 0px 2px 3px gray;
    margin: 0.5em 0;
    padding: 0.5em 0.5em;
    vertical-align: middle;
  }
  .ny1 button {
    width: 6em;
    margin: 0 0.2em;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .ny1 button:hover {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
  }
  .ny1 .title {
    font-size: 2em;
  }
  .ny1 nav {
    float: right;
  }
  .ny1,
  .ny3 {
    text-align: left;
  }
  .ny3 > span {
    font-size: 1.2em;
    color: midnightblue;
  }
  .ny3 textarea {
    width: 100%;
    border: 1px solid #8d95b6;
  }
</style>
