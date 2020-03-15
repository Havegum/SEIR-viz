<script>
import { getContext } from 'svelte';
const { data, xGet, yGet } = getContext('LayerCake');

export let key;
export let color;

$: path = 'M' + $data
    .find(d => d.key === key)
    .values
    .map(d => $xGet(d) + ',' + $yGet(d))
    .join('L');
</script>


<g class="line-group">
  <path
    class='path-line'
    d='{path}'
    stroke="{color}"
  ></path>
</g>


<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3px;
  }
</style>
