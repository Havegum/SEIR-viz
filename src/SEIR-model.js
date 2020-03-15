// Befolkning = 5.367.580
// fra ssb: https://www.ssb.no/befolkning/statistikker/folkemengde/aar-per-1-januar
const N = 5367580;


// Source:
// http://www.public.asu.edu/~hnesse/classes/seir.html?Beta=0.9&Gamma=0.2&Sigma=0.25&Mu=0&Nu=0&initialS=10&initialE=1&initialI=0&initialR=0&iters=15
// (note, we assume vaccination = 0, natural mortality = 0, and population = 1)

// the number of susceptible individuals
const fS = (beta, s, i) => -beta * s * i;

// the number of exposed individuals
const fE = (beta, sigma, s, i, e) => beta * s * i - sigma * e;

// the number of infected individuals
const fI = (gamma, sigma, e, i) => sigma * e - gamma * i;

// the number of recovered individuals
const fR = (gamma, i) => gamma * i;


// Generator for steps
function* generator ({
		infectionRate,
    recoveryRate,
		latentPeriod,
		sickRate = 0,
		hospitalizationRate = 0,
		intensiveRate = 0,
		deathRate = 0,
		s = 1,
    e = 0,
		i = 1e-6,
		r = 0
	} = {})
{
	const beta = infectionRate;
  const gamma = recoveryRate;
	const sigma = latentPeriod;

	while (true) {
    // Calculate deltas
    let dS = fS(beta, s, i);
		let dE = fE(beta, sigma, s, i, e);
		let dI = fI(gamma, sigma, e, i);
		let dR = fR(gamma, i);

    // Update, then yield state
    s += dS;
		e += dE;
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

// Instanciates generator and runs it `iterations` steps
function model ({ iterations, ...options }={}) {
	let gen = generator(options);

	return Array(iterations || 10)
		.fill()
		.map((_, x) => ({ x, ...gen.next().value }))
}


export default model;
