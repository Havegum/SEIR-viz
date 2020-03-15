<script>
export let name = Math.floor(Math.random() * 1e6).toString(36); // lolhash
export let min = 0;
export let max = 1;
export let value = 1;
export let step = 1e-3
</script>


<label for="{name}">
  <p><slot></slot></p>
  <input id="{name}" type="range" bind:value {min} {max} {step}>
</label>
