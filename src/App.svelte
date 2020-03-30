<script>
import Graph from './Graph.svelte';
import Slider from './components/Slider.svelte';
import model, { N } from './model.js';
import { easeExpOut, easeExp } from 'd3-ease';
import { scaleOrdinal } from 'd3-scale';

let visible = ['infected', 'sick', 'hospitalized', 'intensive', 'dead'];
let tweenTarget = null;
let scales = ['all', 'infected', 'hospitalized'];
let yLimits = [N, 4500, 1200];
let yLim = yLimits[1];

function tweenY (target) {
	visible = (target === 'all') ? ['susceptible', 'recovered', 'infected'] : ['infected', 'sick', 'hospitalized', 'intensive', 'dead'];;
	let i;
	const from = yLim;
	const to = yLimits[scales.indexOf(target)];
	const interpolate = from > to ? easeExpOut : easeExp;
	let start = null;
	tweenTarget = target;
	window.requestAnimationFrame(function animate(timestamp) {
		if (tweenTarget !== target) return;
		if (!start) start = timestamp;
		i = Math.min(1, (timestamp - start) / 2000); // ms
		let t = interpolate(i)
		yLim = (1-t) * from + t * to;
		if (i === 1) return;
		window.requestAnimationFrame(animate);
	});
}

function indicate (level) {
	if (level > 0.66) return 'veldig mye';
	if (level > 0.33) return 'mye';
	if (level > -0.33) return 'som normalt';
	if (level > -0.66) return 'lite';
	return 'veldig lite';
}
const colorScale = scaleOrdinal()
	.domain(['susceptible', 'infected', 'sick', 'hospitalized', 'intensive', 'dead', 'recovered'])
	.range(['#dcf3f5', '#decece', '#dda573', '#d0505a', '#5e132e', '#0d0d0d', '#13aa56']);



let recoveryRate = 8 / 15;
let	infectionRate = 1.27 * recoveryRate;
let	sickRate = (1 / 3) * recoveryRate;
let	hospitalizationRecoveryRate = 1 / 10;
let	hospitalizationRate = (12 / 100) * hospitalizationRecoveryRate;
let	intensiveRecoveryRate = 1 / 25;
let	intensiveRate = (3 / 4) * intensiveRecoveryRate;
let deathRate = 5 / 1000; // compared to people in intensive care


let infectionRateAdjust = 0;
let recoveryRateAdjust = 0;
let sickRateAdjust = 0;
let hospitalizationRateAdjust = 0;
let hospitalizationRecoveryRateAdjust = 0;
let intensiveRateAdjust = 0;
let intensiveRecoveryRateAdjust = 0;
let deathRateAdjust = 0;

$: data = model({
	iterations: 180,
	infectionRate: 								infectionRateAdjust + infectionRate,
	recoveryRate: 								recoveryRateAdjust + recoveryRate,
	sickRate: 										sickRateAdjust + sickRate,
	hospitalizationRate: 					hospitalizationRateAdjust + hospitalizationRate,
	hospitalizationRecoveryRate: 	hospitalizationRecoveryRateAdjust + hospitalizationRecoveryRate,
	intensiveRate: 								intensiveRateAdjust + intensiveRate,
	intensiveRecoveryRate: 				intensiveRecoveryRateAdjust + intensiveRecoveryRate,
	deathRate: 										deathRateAdjust + deathRate
});
</script>


<div class="controls">
	<button on:click={() => tweenY('all')}>Hele Norge</button>
	<button on:click={() => tweenY('infected')}>Smittede</button>
	<button on:click={() => tweenY('hospitalized')}>Innlagte</button>


	<Slider bind:value={infectionRateAdjust} min={-infectionRate/10} max={infectionRate/2}>infectionRate</Slider>
	<!-- <Slider bind:value={recoveryRateAdjust} min={-recoveryRate/3} max={recoveryRate/3}>recoveryRate</Slider> -->
	<!-- <Slider bind:value={sickRateAdjust} min={-sickRate/3} max={sickRate/3}>sickRate</Slider> -->
	<!-- <Slider bind:value={hospitalizationRateAdjust} min={-hospitalizationRate/3} max={hospitalizationRate/3}>hospitalizationRate</Slider> -->
	<!-- <Slider bind:value={hospitalizationRecoveryRateAdjust} min={-hospitalizationRecoveryRate/3} max={hospitalizationRecoveryRate/3}>hospitalizationRecoveryRate</Slider> -->
	<!-- <Slider bind:value={intensiveRateAdjust} min={-intensiveRate/3} max={intensiveRate/3}>intensiveRate</Slider> -->
	<!-- <Slider bind:value={intensiveRecoveryRateAdjust} min={-intensiveRecoveryRate/3} max={intensiveRecoveryRate/3}>intensiveRecoveryRate</Slider> -->
	<!-- <Slider bind:value={deathRateAdjust} min={-deathRate/3} max={deathRate/3}>deathRate</Slider> -->
</div>

<div class="graph">
	<Graph {data} {yLim} {visible} {colorScale}/>
</div>


<style lang="scss">
.graph {
	height: 15em; // NB: Layercake must have nonzero height !important
	width: 60em;
	margin-bottom: 1em;
}
</style>
