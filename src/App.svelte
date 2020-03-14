<script>
import Graph from './Graph.svelte';
import Slider from './components/Slider.svelte';
import { model, generator } from './model.js';

let p = 0.17;
// R0 = 1.3 (kilde: FHI)
let contactRate = Math.floor(1.3 / p);
// $: infectionRate = contagiousness * contact;
let covidDaysIll = 4;
$: covidRecoveryRate = 1 / covidDaysIll;
$: covidInfectionRate = p * contactRate * covidRecoveryRate;

let iterations = 365;

$: covidData = model({
	generator: generator(covidInfectionRate, covidRecoveryRate),
	iterations
});



// Influensatall
// "Most people recover from fever and other symptoms within a week"
// (from https://www.who.int/en/news-room/fact-sheets/detail/influenza-(seasonal))
let fluRecoveryRate = 1 / 7;
// infection rate / recovery rate = R0,
// so infection rate = recovery rate * R0
// "The median R value for seasonal influenza was 1.28"
// (from: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5623938/)
let fluInfectionRate = fluRecoveryRate * 1.28

$: fluData = model({
	generator: generator(fluInfectionRate, fluRecoveryRate),
	iterations
});

let yScale = 10e4
</script>


<div class="wrap">
	<h2>Influensa</h2>
	<Graph data={fluData} height={yScale}/>
</div>

<div class="wrap">
	<h2>Korona</h2>
	<Graph data={covidData} height={yScale}/>
</div>

<div class="controls">
	<Slider bind:value={p} min={0.15} max={0.36}>Smittegrad: {Math.floor(p * 100)} %</Slider>
	<Slider bind:value={contactRate} min={0} max={12} step={0.5}>Kontakthyppighet: {contactRate}</Slider>
	<Slider bind:value={covidDaysIll} min={3} max={8}>Dager syk</Slider>
	<Slider bind:value={iterations} min={30} max={730} step={1}>Dager</Slider>
	<Slider bind:value={yScale} min={8e4} max={5e5} step={1000}>y-akse</Slider>
</div>

<style lang="scss">
.wrap {
	height: 15em;
	width: 60em;
	margin: 0 auto;

	+ .wrap {
		margin-top: 5em;
	}
}
</style>
