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