<script>
import { LayerCake, Svg } from 'layercake';
import AxisX from './components/AxisX.svelte';
import AxisY from './components/AxisY.svelte';
import Multiline from './components/Multiline.svelte';

import { scaleOrdinal } from 'd3-scale';
export let height = null;
export let data = [];

$: longData = toLong(data);
$: flatData = flatten(longData);

function toLong (data) {
  return Object.keys(data[0]).map(key => {
  	if (key === 'x') return null;
  	return {
  		key,
  		values: data.map(d => {
  			return { key, x: d.x, value: d[key] };
  		})
  	};
  }).filter(d => d);
}

const flatten = data => data.reduce((store, group) => store.concat(group.values), []);

const colorScale = scaleOrdinal()
  .domain(['S', 'I', 'R'])
  .range(['#00F3', '#F00', '#0F03']);
</script>

<div class="chart-container">
  <LayerCake
    padding={{ right: 10, bottom: 20, left: 25 }}
    x={'x'}
    y={'value'}
    yDomain={[0, height]}
    {flatData}
    data={longData}
  >
    <Svg>
      <AxisX/>
      <AxisY/>
      <Multiline {colorScale}/>
    </Svg>
  </LayerCake>
</div>


<style>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
