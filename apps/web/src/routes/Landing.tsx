import { Link } from 'react-router';
import en from '../i18n/en.json';

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-ink">
      {/* Header */}
      <header className="border-b border-line bg-white">
        <nav className="mx-auto max-w-7xl px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white font-heading font-bold text-lg">
                V
              </div>
              <span className="font-heading text-lg font-bold">Vixir</span>
            </div>
            <ul className="hidden gap-6 md:flex">
              <li><a href="#" className="text-sm font-medium hover:text-primary">How it works</a></li>
              <li><a href="#" className="text-sm font-medium hover:text-primary">Experiments</a></li>
              <li><a href="#" className="text-sm font-medium hover:text-primary">For institutions</a></li>
              <li><a href="#" className="text-sm font-medium hover:text-primary">Open source</a></li>
            </ul>
            <div className="flex gap-3">
              <Link to="/auth" className="text-sm font-medium hover:underline">Sign in</Link>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">Request a demo</button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Blue background */}
      <section className="bg-[#0B1220] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="text-white">
              <p className="text-sm font-semibold text-blue-300">Virtual practical laboratory</p>
              <h1 className="mt-3 font-heading text-5xl font-bold leading-tight sm:text-6xl">Every student deserves a real practical.</h1>
              <p className="mt-6 text-base leading-relaxed text-blue-100">
                Vixir is a browser-based lab for physics, chemistry, electronics and engineering. Students set up apparatus, take imperfect readings, plot graphs and get their lab reports marked — on any device, even offline.
              </p>
              <div className="mt-8 flex gap-3 sm:flex-row">
                <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90">Get started free</button>
                <button className="rounded-lg border border-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-900">Try the pendulum lab</button>
              </div>
              <p className="mt-4 text-xs text-blue-300">Built around WAEC, NECO and university first-year practicals.</p>
            </div>
            <div className="rounded-lg bg-[#0B1220] p-8 text-white">
              <div className="font-mono text-sm text-blue-200">Simple pendulum: g determination</div>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center border-b border-blue-800 pb-2">
                  <span className="text-sm">Length L</span>
                  <span className="font-mono text-lg font-semibold">68.0 cm</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-800 pb-2">
                  <span className="text-sm">Time for 20 oscillations</span>
                  <span className="font-mono text-lg font-semibold text-blue-300">31.27 s</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm">Oscillations counted</span>
                  <span className="font-mono text-lg font-semibold">1,564 s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { title: 'THE PROBLEM', desc: 'Labs are expensive. Practicals are rationed. Many schools share one set of apparatus between whole classes. Students see a demonstration, then sit an exam where they must do it themselves.' },
              { title: 'WHAT VIXIR DOES', desc: 'Simulates the practical, not just the physics. Instruments have resolution, zero error and human timing lag. Students learn to repeat, average and judge error.' },
              { title: 'THE RESULT', desc: 'Every student, every experiment, marked. Teachers assign practicals to the whole class and see class-wide results and common mistakes.' }
            ].map((item, i) => (
              <div key={i}>
                <p className="text-xs font-bold text-primary uppercase tracking-wide">{item.title}</p>
                <p className="mt-3 text-base text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-heading text-3xl font-bold">How a Vixir practical works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: '01', title: 'Set up the apparatus', desc: 'Drag stamps, wire, burettes and meters onto the bench. Wrong connections block the next step.' },
              { num: '02', title: 'Take real readings', desc: 'Read scales, start and stop the stopwatch yourself. Each student data is unique, so results cant be copied.' },
              { num: '03', title: 'Tabulate and plot', desc: 'Fill the results table, choose axes and scale, draw the line of best fit and calculate the slope.' },
              { num: '04', title: 'Get marked, step by step', desc: 'Is your g within 3%? Did you show your figures, graph, calculation and precautions.' }
            ].map((item) => (
              <div key={item.num}>
                <div className="font-heading text-sm font-bold text-primary">{item.num}</div>
                <h3 className="mt-2 font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Labs - Dark background */}
      <section className="border-t border-line bg-[#0B1220] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-heading text-3xl font-bold">Four laboratories in one browser tab</h2>
          <p className="mt-2 text-sm text-blue-200">Starting with the practicals students are examined on.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Physics', desc: 'Simple pendulum. Refraction through a glass block. Ohms law. Specific heat capacity.' },
              { title: 'Chemistry', desc: 'Acidbase titration. Quantitative analysis. Rates of reaction.' },
              { title: 'Electronics', desc: 'Resistor characteristics & transistor characteristics & logic gates.' },
              { title: 'Engineering', desc: 'Beam deflection. Tensile testing. Fluid flow & hydraulic pressure.' }
            ].map((lab) => (
              <div key={lab.title} className="rounded-lg border border-blue-700 bg-[#0B1220] p-6">
                <h3 className="font-heading text-lg font-semibold">{lab.title}</h3>
                <p className="mt-2 text-sm text-blue-200">{lab.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Institutions */}
      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-heading text-3xl font-bold">Built for the whole institution</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: 'Students', desc: 'In a notebook that keeps every result, and a Socratic assistant that asks questions instead of giving answers.' },
              { title: 'Teachers & lecturers', desc: 'Assign a practical to 200 students in a minute. Auto-marked reports, class-wide error analysis.' },
              { title: 'Institutions', desc: 'See licences, usage reports for accreditation visits, and a local-server mode for weak internet.' }
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline */}
      <section className="border-t border-line bg-[#FFF7ED] py-8">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
          <p className="text-sm font-semibold text-[#C2410C]">Works offline. Runs on a budget Android phone.</p>
          <p className="mt-1 text-xs text-[#9A3412]">Install Vixir once, run practicals with no data, and results sync when a connection returns.</p>
        </div>
      </section>

      {/* Open Source */}
      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-heading text-3xl font-bold">Free for every school. Open for everyone to improve.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              { title: 'Use it free', desc: 'No license fees for students, teachers or institutions.' },
              { title: 'Host it yourself', desc: 'Build it in a school server, even without internet.' },
              { title: 'Add experiments', desc: 'Every practical is a config file the anyone can write and share.' },
              { title: 'Translate it', desc: 'Help bring Vixir into more languages and contexts.' }
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex gap-3">
            <button className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90">View on GitHub</button>
            <button className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-page">Contribute an experiment</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-ink py-8 text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold">Vixir</span>
            <span className="text-xs text-blue-300">Virtual Practical Laboratory</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
