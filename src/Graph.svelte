<script>
import { LayerCake, Svg } from 'layercake';
import AxisX from './components/AxisX.svelte';
import AxisY from './components/AxisY.svelte';
import Line from './components/Line.svelte';
import Area from './components/Area.svelte';

import { scaleOrdinal, scaleTime } from 'd3-scale';
export let yLim = null;
export let data = [];
export let visible;
export let colorScale;

const FEB26 = new Date('2020-02-26').getTime();

$: fields = Object.keys(data[0]).filter(d => d !== 'x');

$: longData = toLong(data);
$: flatData = flatten(longData);

function toLong (data) {
  return fields.map(key => {
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


function formatTick (x) {
  return new Date(FEB26 + x * 1000 * 60 * 60 * 24).toLocaleString('nb-NO', { month: 'long'});
}
</script>


<div class="chart-container">
  <LayerCake
    padding={{ right: 10, bottom: 20, left: 25 }}
    x={'x'}
    y={'value'}
    yDomain={[0, yLim]}
    {flatData}
    data={longData}
  >
    <Svg>
      <AxisX {formatTick}/>
      <AxisY/>
      {#each fields as key, i}
        <Line {key} color={colorScale(key)} visible={visible.indexOf(key) > -1}/>
        <Area {key} color={colorScale(key)} visible={visible.indexOf(key) > -1}/>
      {/each}

      {#each visible as key, i}
        <!-- TODO: style labels -->
        <!-- IDEA: Use LayerCakes `Html`-component for pixel-perfect fonts -->
        <rect fill={colorScale(key)} width="10" height="10" y={5 + 15 * i} x="10"/>
        <text y={15 + 15 * i} x="22">{key}</text>
      {/each}
    </Svg>
  </LayerCake>
</div>


<style>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
