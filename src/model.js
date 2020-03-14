// Befolkning = 5.367.580
// fra ssb: https://www.ssb.no/befolkning/statistikker/folkemengde/aar-per-1-januar
const N = 5367580;


// the number of susceptible individuals
const fS = (beta, i, s) => -beta * i * s;

// the number of infected individuals
const fI = (beta, i, s, gamma) => beta * i * s - gamma * i;

// the number of recovered individuals
const fR = (gamma, i) => gamma * i;


function* generator ({
		infectionRate,
		recoveryRate,
		sickRate = 0,
		hospitalizationRate = 0,
		intensiveRate = 0,
		deathRate = 0,
		s = 1,
		i = 1e-6,
		r = 0
	} = {})
{
	const beta = infectionRate;
	const gamma = recoveryRate;

	while (true) {
    // Calculate deltas
		let dS = fS(beta, i, s);
		let dI = fI(beta, i, s, gamma);
		let dR = fR(gamma, i);

    // Update, then yield state
		s += dS;
		i += dI;
		r += dR;

		let I = i * N;

		yield {
			infected: I,
			sick: I * sickRate,
			hospitalized: I * hospitalizationRate,
			intensiveCare: I * intensiveRate,
			dead: I * deathRate
		};
	}
}

function model (options) {
	let gen = generator(options);

	return Array(options.iterations || 10)
		.fill()
		.map((_, x) => ({ x, ...gen.next().value }))
}


export default model;
