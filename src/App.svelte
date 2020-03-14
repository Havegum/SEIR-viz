<script>
import Graph from './Graph.svelte';
import Slider from './components/Slider.svelte';
import { model, generator } from './model.js';

let contagiousness = 0.57;
let contact = 0.53;
$: infectionRate = contagiousness * contact;

let recoveryRate = 0.25;

let iterations = 365;

$: data = model({
	generator: generator(infectionRate, recoveryRate),
	iterations
});
</script>


<div class="wrap">
	<Graph {data} />
</div>

<div class="controls">
	<Slider bind:value={contagiousness} min={0.5} max={0.6}>Smittegrad</Slider>
	<Slider bind:value={contact} min={0.5} max={0.6}>Kontakthyppighet</Slider>
	<Slider bind:value={recoveryRate} min={0.2} max={0.3}>recoveryRate</Slider>
	<Slider bind:value={iterations} min={30} max={730} step={1}>Dager</Slider>
</div>

<style lang="scss">
.wrap {
	height: 30em;
	width: 60em;
	margin: 0 auto;
}
</style>
