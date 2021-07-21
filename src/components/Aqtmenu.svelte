<script>
  let mitems = [
    {nm : '총괄현황', url : 'dashboard', cnm : ''},
    {nm : '테스트별 수행현황', url : 'bytcode', cnm : ''},
    {nm : '업무별 수행현황', url : 'byapp', cnm : ''},
    {nm : '상세수행현황', url : 'detail',cnm : ''},
    {nm : '수행결과비교', url : 'comp', cnm : ''},
    {nm : '전문처리현황', url : 'view', cnm : ''},
  ]

  export let selected = mitems[0] ;

  function select_item(item) {
    selected = item
    console.log(item)
  }
</script>

<div>
  <img src="/images/Logo.png" alt="">
  <p></p>
  <img src="/images/result.png" alt="">
  <ul>
    {#each mitems as item}
    <li on:click={() => select_item(item)}>{item.nm}</li>
    {/each}
  </ul>
</div>

<style>
  * {
    color: white ;
    background-color: blue;
    padding: 0.5rem;
  }
  div {
    text-align: left;
  }
  img {
    padding: 0px;
    margin-bottom: 0px;
  }
  ul{
   font-family: '나눔바른고딕' ;
     list-style:none;
     padding: 0px;
     font-size: 1.3rem;
     text-align: left;
  }
  li {
    cursor: pointer ;
  }
  li:hover {
	  text-decoration: underline;
  }

  </style>
  
