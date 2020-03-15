<script>
import { getContext } from 'svelte';
export let key;
export let color = '#000';
export let visible = false;

const { data, xGet, yGet, xScale, yScale, extents } = getContext('LayerCake');

$: path = 'M' + $data
  .find(d => d.key === key)
  .values
  .map(d => $xGet(d) + ',' + $yGet(d))
  .join('L');

let area;

$: {
  const yRange = $yScale.range();
  area = path + (
    'L' + $xScale($extents.x[1]) + ',' + yRange[0] +
    'L' + $xScale($extents.x[0]) + ',' + yRange[0] +
    'Z'
  );
}
</script>


<path class='path-area' class:visible d='{area}' fill={color} ></path>


<style>
.path-area {
  opacity: 0;
  transition: opacity 400ms;
}

.visible {
  opacity: 0.2;
}
</style>
