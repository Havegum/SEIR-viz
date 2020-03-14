<script>
import Graph from './Graph.svelte';
import Slider from './components/Slider.svelte';
import model from './model.js';

let p = 0.17;
// R0 = 1.3 (tall fra FHI)
let contactRate = Math.floor(1.3 / p);
// $: infectionRate = contagiousness * contact;
let covidDaysIll = 4;
$: covidRecoveryRate = 1 / covidDaysIll;
$: covidInfectionRate = p * contactRate * covidRecoveryRate;

// Fra FHI:
let covidSickRate = 1 / 3;
let covidHospitalizationRate = 3 / 100;
let covidIntensiveRate = covidHospitalizationRate * 0.25;

let covidDeathRate = 0.01;

let iterations = 365;

$: covidData = model({
	iterations,

	infectionRate: covidInfectionRate,
	recoveryRate: covidRecoveryRate,
	sickRate: covidSickRate,
	hospitalizationRate: covidHospitalizationRate,
	intensiveRate: covidIntensiveRate,
	deathRate: covidDeathRate
});


// Influensatall
let fluRecoveryRate = 1 / 7;
// "Most people recover from fever and other symptoms within a week"
// (from https://www.who.int/en/news-room/fact-sheets/detail/influenza-(seasonal))

let fluInfectionRate = fluRecoveryRate * 1.28
// infection_rate / recovery_rate = R0,
// so infection_rate = recovery_rate * R0
// "The median R value for seasonal influenza was 1.28"
// (from: https://bmcinfectdis.biomedcentral.com/articles/10.1186/1471-2334-14-480)

let fluDeathRate = 0.001;
// from: https://web.archive.org/web/20091020120444/http://www.themalaysianinsider.com/index.php/world/37983-h1n1-fatality-rates-comparable-to-seasonal-flu

$: fluData = model({
	iterations,

	infectionRate: fluInfectionRate,
	recoveryRate: fluRecoveryRate,
	deathRate: fluDeathRate
});

let yScale = 10e4
</script>


<div class="wrap">
	<h2>Influensa</h2>
	<Graph data={fluData} height={yScale}/>
</div>

<div class="wrap">
	<h2>Korona</h2>
	<Graph data={covidData} height={yScale} fields={['infected', 'sick', 'dead']}/>
</div>

<div class="controls">
	<Slider bind:value={p} min={0.15} max={0.36}>Smittegrad: {Math.floor(p * 100)} %</Slider>
	<Slider bind:value={contactRate} min={0} max={10} step={0.1}>Kontakthyppighet: {Math.floor(contactRate)}</Slider>
	<Slider bind:value={covidDaysIll} min={3} max={8}>Dager syk</Slider>
	<Slider bind:value={iterations} min={30} max={730} step={1}>x-akse</Slider>
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
