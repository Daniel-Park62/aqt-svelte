<script context="module">
  const lvlnm = { 0: "Origin", 1: "단위", 2: "통합", 3: "정합성" };
  const typenm = { 0: "", 1: "배치", 2: "실시간" };
  export function getLvlnm(l) {
    return lvlnm[l];
  }
  export function getTypenm(l) {
    return typenm[l];
  }
  export function getTypes() {
    return typenm;
  }
  export function getLvls() {
    return lvlnm;
  }
</script>

<style>
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
