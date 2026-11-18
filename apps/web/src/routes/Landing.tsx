import { Link } from 'react-router';
import en from '../i18n/en.json';

export function Landing() {
  return (
    <div className="min-h-screen bg-page text-ink">
      {/* Header */}
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white font-heading font-bold text-lg">
              V
            </div>
            <span className="font-heading text-lg font-bold">Vixir</span>
          </div>
          <ul className="hidden gap-8 md:flex">
            <li><a href="#" className="text-sm font-medium hover:text-primary">How it works</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-primary">Experiments</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-primary">For institutions</a></li>
            <li><a href="#" className="text-sm font-medium hover:text-primary">Open source</a></li>
          </ul>
          <div className="flex gap-3">
            <Link to="/auth" className="text-sm font-medium text-primary hover:underline">Sign in</Link>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">Request a demo</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="border-b border-line bg-gradient-to-b from-page to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Virtual practical laboratory</p>
              <h1 className="mt-3 font-heading text-5xl font-bold leading-tight sm:text-6xl">Every student deserves a real practical.</h1>
              <p className="mt-6 text-base text-muted leading-relaxed">Vixir is a browser-based lab for physics, chemistry, electronics and engineering. Students set up apparatus, take imperfect readings, plot graphs and get their lab reports marked — on any device, even offline.</p>
              <div className="mt-8 flex gap-3 sm:flex-row">
                <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90">Get started free</button>
                <button className="rounded-lg border border-line px-6 py-3 text-sm font-medium hover:bg-white">Try the pendulum lab</button>
              </div>
              <p className="mt-4 text-xs text-muted">Built around WAEC, NECO and university first-year practicals.</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-blue-900 to-blue-950 p-8 text-white">
              <div className="text-sm font-mono text-blue-200">Simple pendulum: g determination</div>
              <div className="mt-8 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Length L</span>
                  <span className="font-mono text-lg font-semibold">68.0 cm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time for 20 oscillations</span>
                  <span className="font-mono text-lg font-semibold text-blue-300">31.27 s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Oscillations counted</span>
                  <span className="font-mono text-lg font-semibold">1,564 s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wide">THE PROBLEM</p>
              <h3 className="mt-2 font-heading text-2xl font-bold">Labs are expensive. Practicals are rationed.</h3>
              <p className="mt-3 text-sm text-muted">Many schools share one set of apparatus between whole classes. Students see a demonstration, then sit an exam where they must do it themselves.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wide">WHAT VIXIR DOES</p>
              <h3 className="mt-2 font-heading text-2xl font-bold">Simulates the practical, not just the physics.</h3>
              <p className="mt-3 text-sm text-muted">Instruments have resolution, zero error and human timing lag. Students learn to repeat, average and judge error — the practical exists itself.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wide">THE RESULT</p>
              <h3 className="mt-2 font-heading text-2xl font-bold">Every student, every experiment, marked.</h3>
              <p className="mt-3 text-sm text-muted">Teachers assign practicals to the whole class and see class-wide results and common mistakes. Analytics that show where students go wrong.</p>
            </div>
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
              { num: '02', title: 'Take real readings', desc: 'Read scales, start and stop the stopwatch yourself. Each student\'s data is unique, so results can\'t be copied.' },
              { num: '03', title: 'Tabulate and plot', desc: 'Fill the results table, choose axes and scale, draw the line of best fit and calculate the slope.' },
              { num: '04', title: 'Get marked, step by step', desc: 'Is your g within 3%? Did you show your figures, graph, calculation and precautions against the student\'s own data.' }
            ].map((item) => (
              <div key={item.num}>
                <div className="font-heading text-sm font-bold text-primary">{item.num}</div>
                <h3 className="mt-2 font-heading font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Labs */}
      <section className="border-t border-line bg-blue-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-heading text-3xl font-bold">Four laboratories in one browser tab</h2>
          <p className="mt-2 text-sm text-blue-200">Starting with the practicals students are examined on.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Physics', desc: 'Simple pendulum. Refraction through a glass block. Ohms law. Specific heat capacity.' },
              { title: 'Chemistry', desc: 'Acid–base titration. Quantitative analysis. Rates of reaction.' },
              { title: 'Electronics', desc: 'Resistor characteristics & transistor characteristics & logic gates.' },
              { title: 'Engineering', desc: 'Beam deflection. Tensile testing. Fluid flow & hydraulic pressure.' }
            ].map((lab) => (
              <div key={lab.title} className="rounded-lg border border-blue-700 bg-blue-900 p-6">
                <h3 className="font-heading font-semibold">{lab.title}</h3>
                <p className="mt-2 text-sm text-blue-100">{lab.desc}</p>
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
              { title: 'Teachers & lecturers', desc: 'Assign a practical to 200 students in a minute. Auto-marked reports, class-wide error analysis, and an outlier to build your own experiments.' },
              { title: 'Institutions', desc: 'See licences, usage reports for accreditation visits, and a local-server mode for campuses with weak internet.' }
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
      <section className="border-t border-line bg-amber-50 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
          <p className="text-sm font-semibold text-amber-900">Works offline. Runs on a budget Android phone.</p>
          <p className="mt-1 text-xs text-amber-800">Install Vixir once, run practicals with no data, and results sync when a connection returns.</p>
          <button className="mt-3 text-sm font-medium text-amber-900 underline hover:no-underline">See the mobile tab</button>
        </div>
      </section>

      {/* Open Source */}
      <section className="border-t border-line py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-heading text-3xl font-bold">Free for every school. Open for everyone to improve.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: 'Use it free', desc: 'No license fees for students, teachers or institutions.' },
              { title: 'Host it yourself', desc: 'Build it in a school server, even without internet.' },
              { title: 'Add experiments', desc: 'Every practical is a config file the anyone can write and share.' },
              { title: 'Translate it', desc: 'Help bring Vixir into more languages and contexts.' }
            ].map((item, i) => (
              <div key={i} className={i >= 2 ? 'md:col-start-2 md:col-span-1' : ''}>
                <h3 className="font-heading font-semibold">{item.title}</h3>
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
            <span className="text-xs text-blue-300">Virtual Practical Laboratory · CONTACT EMAIL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
