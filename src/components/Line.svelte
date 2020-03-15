<script>
import { getContext } from 'svelte';
const { data, xGet, yGet } = getContext('LayerCake');

export let key;
export let color;
export let visible = false;

$: path = 'M' + $data
    .find(d => d.key === key)
    .values
    .map(d => $xGet(d) + ',' + $yGet(d))
    .join('L');
</script>


<g class="line-group">
  <path
    class='path-line'
    class:visible
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
  opacity: 0;
  transition: opacity 400ms;
}

.visible {
  opacity: 1;
}
</style>
