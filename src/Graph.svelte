<script>
import { LayerCake, Svg } from 'layercake';
import AxisX from './components/AxisX.svelte';
import AxisY from './components/AxisY.svelte';
import Line from './components/Line.svelte';
import Area from './components/Area.svelte';

import { scaleOrdinal } from 'd3-scale';
export let yLim = null;
export let data = [];
export let fields;

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

const colorScale = scaleOrdinal()
  .domain(['infected', 'sick', 'hospitalized', 'dead'])
  .range(['#dcc', '#A19', '#F23', '#000']);

const localize = scaleOrdinal() // .. lol
  .domain(['infected', 'sick', 'hospitalized', 'dead'])
  .range(['smittede', 'syke', 'innlagte', 'døde']);
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
      <AxisX/>
      <AxisY/>
      {#each fields as key, i}
        <Line {key} color={colorScale(key)}/>
        <Area {key} color={colorScale(key)}/>

        <!-- TODO: style labels -->
        <!-- REVIEW: Use LayerCakes `Html`-component for pixel-perfect fonts -->
        <rect fill={colorScale(key)} width="10" height="10" y={5 + 15 * i} x="10"/>
        <text y={15 + 15 * i} x="22">{localize(key)}</text>
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
