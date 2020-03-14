<script>
import { LayerCake, Svg } from 'layercake';
import AxisX from './components/AxisX.svelte';
import AxisY from './components/AxisY.svelte';
import Multiline from './components/Multiline.svelte';

import { scaleOrdinal } from 'd3-scale';
export let height = null;
export let data = [];
export let fields = null;

$: longData = toLong(data);
$: flatData = flatten(longData);

function toLong (data) {

  return (fields || Object.keys(data[0])).map(key => {
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
  .domain(['infected', 'sick', 'dead'])
  .range(['#F00', '#AA0', '#000']);

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
