import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const Logo = () => (
    <div className="logo-container">
      <div className="logo-img-wrapper">
        <Image 
          src="/images/pp-logo-black-tex.png" 
          alt="Proverbs Profits Logo" 
          width={40} 
          height={40} 
          className="logo-img"
        />
      </div>
      <h1 className="logo-text">Proverbs <span className="logo-highlight">Profits</span></h1>
    </div>
  );

  return (
    <>
      <header className="header">
        <Logo />
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="pill">
              <i className="ph-bold ph-lightning"></i>
              Introducing Proverbs Profits
            </div>

            <h1 className="main-headline">
              A Simple <span className="text-green">60 Second WiFi Trick</span><br />
              That Brings <span className="text-orange">Faith &amp; Purpose</span><br />
              To Your Daily Routine
            </h1>

            <p className="subtitle">
              No experience needed. No complicated setup.<br />
              <strong>Just you, your WiFi, and 60 seconds.</strong>
            </p>

            <div className="hero-image-container">
              <Image 
                src="/images/pp-mocku1.png" 
                alt="Proverbs Profits Product Showcase" 
                width={800} 
                height={400} 
                className="hero-image"
                priority
              />
            </div>

            <Link href="/checkout" className="btn-primary">
              <div className="btn-main-text">Yes! Give Me Instant Access &rarr;</div>
              <div className="btn-sub-text">Just $67 One-Time &mdash; Instant Digital Access</div>
            </Link>

            <div className="trust-badges">
              <div className="badge">
                <i className="ph ph-lock-key"></i> Secure Checkout
              </div>
              <div className="badge">
                <i className="ph ph-shield-check"></i> 256-bit Encryption
              </div>
              <div className="badge">
                <i className="ph ph-check-circle"></i> Instant Access
              </div>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">
              Here&apos;s What You Get Inside<br />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <Image src="/images/pp-logo-black-tex.png" alt="" width={35} height={35} />
                <span className="text-green">Proverbs Profits</span>
              </div>
            </h2>

            <div className="feature-box">
              <div className="feature-item">
                <div className="feature-icon green">
                  <i className="ph-fill ph-check-circle"></i>
                </div>
                <div className="feature-content">
                  <h3>The 60 Second WiFi Trick &mdash; Activated</h3>
                  <p>The simple, beginner-friendly method at the heart of the Proverbs Profits system &mdash; ready to go in under a minute.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon green">
                  <i className="ph-fill ph-check-circle"></i>
                </div>
                <div className="feature-content">
                  <h3>Step-By-Step Training</h3>
                  <p>Built around Proverbs principles &mdash; aligning the work you do online with purpose, integrity, and gratitude.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon green">
                  <i className="ph-fill ph-check-circle"></i>
                </div>
                <div className="feature-content">
                  <h3>Members-Only Community Access</h3>
                  <p>Connect with like-minded people on the same journey &mdash; encouragement, accountability, and shared wins.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* How It Works Section */}
        <section className="steps-section">
          <div className="container">
            <h2 className="section-title">
              How It Works &mdash;<br />
              <span className="text-green">3 Simple Steps</span>
            </h2>

            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Get Instant Access</h3>
                  <p>Click the button below, complete your secure checkout, and your members area opens immediately &mdash; no waiting, no shipping.</p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Activate the 60 Second WiFi Trick</h3>
                  <p>Follow the simple setup inside the members area. It only takes 60 seconds and requires nothing more than your phone and a WiFi connection.</p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Build Something With Purpose</h3>
                  <p>Work through the faith-based training, lean on the community, and take it one day at a time &mdash; guided every step of the way by Pastor Chuck.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* For You Section */}
        <section className="for-you-section">
          <div className="container">
            <h2 className="section-title">This Is For You If...</h2>

            <div className="for-you-box">
              <div className="for-you-item">
                <div className="feature-icon orange">
                  <i className="ph-fill ph-check-circle"></i>
                </div>
                <p>You want to do something meaningful online &mdash; not just mindless scrolling</p>
              </div>

              <div className="for-you-item">
                <div className="feature-icon orange">
                  <i className="ph-fill ph-check-circle"></i>
                </div>
                <p>You have zero tech experience and need something that truly starts simple</p>
              </div>

              <div className="for-you-item">
                <div className="feature-icon orange">
                  <i className="ph-fill ph-check-circle"></i>
                </div>
                <p>You&apos;re looking for a faith-centered approach &mdash; not a hustle-at-all-costs mindset</p>
              </div>

              <div className="for-you-item">
                <div className="feature-icon orange">
                  <i className="ph-fill ph-check-circle"></i>
                </div>
                <p>You&apos;re ready to take one small step today instead of putting it off again</p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* Final CTA Section */}
        <section className="final-cta">
          <div className="container">
            <div className="cta-mini-heading">
              <i className="ph-bold ph-lightning"></i> Get Started Right Now
            </div>

            <h2 className="section-title mb-sm">
              Your 60 Second WiFi Trick<br />
              Is Ready To Be Activated
            </h2>

            <p className="cta-subtitle">
              One small act of faith. One click. Everything you need is on the other side.
            </p>

            <Link href="/checkout" className="btn-primary mt-lg">
              <div className="btn-main-text">Yes! Give Me Instant Access &rarr;</div>
              <div className="btn-sub-text">Just $67 One-Time &mdash; Instant Digital Access</div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px', opacity: 0.8 }}>
          <Image src="/images/pp-logo-black-tex.png" alt="" width={24} height={24} style={{ filter: 'grayscale(1) brightness(2)' }} />
          <span>Proverbs Profits</span>
        </div>
        <p>&copy; 2026 Proverbs Profits. All rights reserved.</p>
      </footer>
    </>
  );
}
