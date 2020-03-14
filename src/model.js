// Befolkning = 5.367.580
// fra ssb: https://www.ssb.no/befolkning/statistikker/folkemengde/aar-per-1-januar
const N = 5367580;


// the number of susceptible individuals
const s = (beta, I, S) => -beta * I * S;

// the number of infected individuals
const i = (beta, I, S, gamma) => beta * I * S - gamma * I;

// the number of recovered individuals
const r = (gamma, I) => gamma * I;

function* generator (beta, gamma, S=1, I=1e-6, R=0) {
	while (true) {
    // Calculate deltas
		let dS = s(beta, I, S);
		let dI = i(beta, I, S, gamma);
		let dR = r(gamma, I);

    // Update, then yield state
		S += dS;
		I += dI;
		R += dR;
		yield { S, I, R };
	}
}

function scaleToPop (d) {
  d.S *= N;
  d.I *= N;
  d.R *= N;
  return d;
}

function model ({ generator, iterations }) {
	return Array(iterations)
		.fill()
		.map((_, x) => ({ x, ...generator.next().value }))
		.map(scaleToPop)
}


export { generator, model };
