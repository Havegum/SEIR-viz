<script>
import Graph from './Graph.svelte';
import Slider from './components/Slider.svelte';
import model, { N } from './SEIR-model.js';
import { easeExpOut, easeExp } from 'd3-ease';

let p = 0.141; // NB: Magic number

let visible = ['recovered', 'infected'];
let tweenTarget = null;
let scales = ['all', 'infected', 'hospitalized'];
let yLimits = [N, 1e5, 5e3];
let yLim = N;

function tweenY (target) {
	// Change visible
	visible = (target === 'all') ? ['recovered', 'infected'] : ['sick', 'hospitalized', 'infected'];

	// Animation setup
	let i;
	const from = yLim;
	const to = yLimits[scales.indexOf(target)];
	const interpolate = from > to ? easeExpOut : easeExp;

	let start = null;
	tweenTarget = target;
	// Off it goes!
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

let handWashAdjust = 0;
let isolatednessAdjust = 0;

// REVIEW: Juster kontrollsensitivitet her (0.04 nå):
$: handWash     = 1 + 0.04 * handWashAdjust;
$: isolatedness = 1 + 0.04 * isolatednessAdjust;

$: contactRate = (3 / handWash) * (3 / isolatedness);

let duration = 3.5;
$: recoveryRate = 1 / duration;
$: infectionRate = p * contactRate * recoveryRate;

let latentPeriod = 1 - 1 / 3;

// Fra FHI:
let sickRate = 1 / 3;
let hospitalizationRate = 3 / 100;
let intensiveRate = hospitalizationRate * 0.25;

let deathRate = 0.01;

// Days to simulate
let iterations = 365;

$: data = model({
	iterations,
	infectionRate,
	latentPeriod,
	recoveryRate,
	sickRate,
	hospitalizationRate,
	intensiveRate,
	deathRate
});
// NB: model returns the following fields:
// ['infected', 'sick', 'hospitalized', 'intensiveCare', 'dead', 'recovered']

// TODO: better text
function indicate (level) {
	if (level > 0.66) return 'veldig mye';
	if (level > 0.33) return 'mye';
	if (level > -0.33) return 'som normalt';
	if (level > -0.66) return 'lite';
	return 'veldig lite';
}
</script>


<!-- TODO: style, layout -->
<div class="controls">
	<button on:click={() => tweenY('all')}>Hele Norge</button>
	<button on:click={() => tweenY('infected')}>Smittede</button>
	<button on:click={() => tweenY('hospitalized')}>Innlagte</button>

	<Slider bind:value={handWashAdjust}     min={-1} max={1}>Håndvask: {indicate(handWashAdjust)}</Slider>
	<Slider bind:value={isolatednessAdjust} min={-1} max={1}>Isoleringsgrad: {indicate(isolatednessAdjust)}</Slider>
</div>

<div class="graph">
	<Graph {data} {yLim} {visible}/>
</div>


<style lang="scss">
.graph {
	height: 15em; // NB: Layercake must have nonzero height !important
	width: 60em;
	margin-bottom: 1em;
}
</style>
