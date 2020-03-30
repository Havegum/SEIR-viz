// Befolkning = 5.367.580
// fra ssb: https://www.ssb.no/befolkning/statistikker/folkemengde/aar-per-1-januar
const N = 5367580;


// Source:
// http://www.public.asu.edu/~hnesse/classes/seir.html?Beta=0.9&Gamma=0.2&Sigma=0.25&Mu=0&Nu=0&initialS=10&initialE=1&initialI=0&initialR=0&iters=15
// (note, we assume vaccination = 0, natural mortality = 0, and population = 1)

// the number of susceptible individuals
const fS = (beta, s, i, k, h, c) =>
	-beta * s * (i + k);

// the number of infected (potentially asymptomatic) individuals
const fI = (beta, s, i, k, h, c, gamma, sickRate) =>
	beta * s * (i + k) - gamma * i - sickRate * i;

// the number of sick individuals
const fK = (i, sickRate, k, gamma, hospitalizationRate) =>
	sickRate * i - gamma * k - hospitalizationRate * k;

// the number of hospitalized individuals
const fH = (hospitalizationRate, k, hospitalizationRecoveryRate, h, intensiveRate) =>
	hospitalizationRate * k - hospitalizationRecoveryRate * h - intensiveRate * h;

// the number of individuals in intensive care
const fC = (intensiveRate, h, intensiveRecoveryRate, c, deathRate) =>
	intensiveRate * h - intensiveRecoveryRate * c - deathRate * c;

// deaths
const fD = (deathRate, c) =>
	deathRate * c;

const fR = (gamma, i, k, h, c, hospitalizationRecoveryRate, intensiveRecoveryRate) =>
	gamma * (i + k + h + c) + h * hospitalizationRecoveryRate + c * intensiveRecoveryRate;

// Generator for steps
function* generator ({
		infectionRate = 0.30,
    recoveryRate = 10 / 45,
		sickRate = 1 / 3,
		hospitalizationRate = 35 / 1000,
		hospitalizationRecoveryRate = 1 / 10,
		intensiveRate = 1 / 4,
		intensiveRecoveryRate = 1 / 25,
		deathRate = 0,

		s = 1,
    i = 1 / N,
		k = 0,
		h = 0,
		c = 0,
		d = 0,
		r = 0
	} = {})
{
	const beta = infectionRate;
  const gamma = recoveryRate;

	while (true) {
    // Calculate deltas
    let dS = fS(beta, s, i, k, h, c);
		let dI = fI(beta, s, i, k, h, c, gamma, sickRate);

		let dK = fK(i, sickRate, k, gamma, hospitalizationRate);
		let dH = fH(hospitalizationRate, k, hospitalizationRecoveryRate, h, intensiveRate);
		let dC = fC(intensiveRate, h, intensiveRecoveryRate, c, deathRate);
		let dD = fD(deathRate, c);

		let dR = fR(gamma, i, k, h, c, hospitalizationRecoveryRate, intensiveRecoveryRate);


    // Update, then yield state
    s += dS; // susceptible
		i += dI; // infected

		k += dK; // sick
		h += dH; // hospitalized
		c += dC; // intensive care
		d += dD; // dead

		r += dR; // recovered

		let I = i * N;

		yield {
			susceptible: s * N,
			infected: (i + k + h + c) * N,
			sick: (k + h + c) * N,
			hospitalized: (h + c) * N,
			intensive: c * N,
			dead: d * N,
      recovered: r * N
		};
	}
}

// Instanciates generator and runs it `iterations` steps
function model ({ iterations, ...options }={}) {
	let gen = generator(options);

	return Array(iterations || 10)
		.fill()
		.map((_, x) => ({
			x,
			...gen.next().value
		}))
}


export default model;
export { N };
