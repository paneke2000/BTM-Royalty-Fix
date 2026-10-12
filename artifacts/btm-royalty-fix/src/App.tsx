import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coins,
  Info,
  Music2,
  RotateCcw,
  ScanEye,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';
import {
  calculateDemo,
  formatMoney,
  poolContributors,
  sampleTracks,
  TRACK_THRESHOLD,
} from './lib/demo-math';

type SavedDemo = {
  poolAmount: number;
  allocationPercent: number;
  claimed: boolean;
  claimedAmount: number;
  claimedAt: string | null;
};

const STORE_KEY = 'btm-royalty-fix-demo-v1';
const DEFAULTS: SavedDemo = {
  poolAmount: 100,
  allocationPercent: 10,
  claimed: false,
  claimedAmount: 0,
  claimedAt: null,
};

function loadDemoState(): SavedDemo {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return DEFAULTS;
    const saved = JSON.parse(raw) as Partial<SavedDemo>;
    return {
      ...DEFAULTS,
      ...saved,
      poolAmount: Number.isFinite(saved.poolAmount) ? Math.max(0, saved.poolAmount as number) : DEFAULTS.poolAmount,
      allocationPercent: Number.isFinite(saved.allocationPercent)
        ? Math.min(100, Math.max(0, saved.allocationPercent as number))
        : DEFAULTS.allocationPercent,
    };
  } catch {
    return DEFAULTS;
  }
}

function App() {
  const [demo, setDemo] = useState<SavedDemo>(loadDemoState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [resetMessage, setResetMessage] = useState(false);
  const math = useMemo(
    () => calculateDemo(demo.poolAmount, demo.allocationPercent),
    [demo.poolAmount, demo.allocationPercent],
  );
const remainingBalance = demo.claimed ? 0 : math.allocation;

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(demo));
    } catch {
      // Demo still works for this visit when browser storage is unavailable.
    }
  }, [demo]);

  useEffect(() => {
    if (!confirmOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [confirmOpen]);

  const updateAmount = (value: string) => {
    const parsed = Number(value);
    setDemo((current) => ({ ...current, poolAmount: Number.isFinite(parsed) ? Math.max(0, parsed) : 0 }));
    setResetMessage(false);
  };

  const updatePercent = (value: string) => {
    const parsed = Number(value);
    setDemo((current) => ({
      ...current,
      allocationPercent: Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0,
    }));
    setResetMessage(false);
  };

  const confirmClaim = () => {
    if (demo.claimed || math.allocation <= 0) return;
    const now = new Date().toISOString();
    setDemo((current) => ({
      ...current,
      claimed: true,
      claimedAmount: math.allocation,
      claimedAt: now,
    }));
    setClaimMessage('Demo claim successful! Your simulated USDC allocation has been recorded.');
    setConfirmOpen(false);
  };

  const resetDemo = () => {
    setDemo({ ...DEFAULTS });
    setClaimMessage('');
    setConfirmOpen(false);
    setResetMessage(true);
  };

  return (
    <main className="min-h-[100dvh] pb-12">
      <header className="topbar">
        <div className="page-shell topbar-inner">
          <div className="brand-lockup" aria-label="BTM Royalty Fix, Beyond the Music">
            <div className="brand-mark"><span>BTM</span><span className="brand-wave" aria-hidden="true"><i /><i /><i /></span></div>
            <div className="brand-words">
              <strong>BTM ROYALTY FIX</strong>
              <span>BEYOND THE MUSIC</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="demo-chip"><span /> DEMO ENVIRONMENT</div>
            <div className="notification-wrap">
              <button
                type="button"
                className="icon-button focus-ring"
                aria-label="Notifications"
                aria-expanded={showNotice}
                onClick={() => setShowNotice((open) => !open)}
                data-testid="button-notifications"
              >
                <Bell size={17} strokeWidth={1.8} />
                <i className="notification-dot" />
              </button>
              {showNotice && (
                <div className="notification-popover" role="status">
                  <div className="notice-head"><strong>Demo notice</strong><button type="button" aria-label="Close notifications" onClick={() => setShowNotice(false)}><X size={14} /></button></div>
                  <p>All balances and payout figures on this page are illustrative.</p>
                </div>
              )}
            </div>
            <div className="profile" aria-label="My Son — BTM Recording Artist">
              <div className="avatar">MS</div>
              <div className="profile-name"><strong>My Son</strong><span>BTM Recording Artist</span></div>
              <ChevronRight size={15} className="profile-chevron" />
            </div>
          </div>
        </div>
      </header>

      <div className="page-shell">
        <section className="founder-intro panel" aria-label="Founder story">
          <p>
            <span>Built by a label co-founder and father. My son is a Nigerian artist.</span>
            <span>Four of his five tracks earn $0.00 despite 4,090 combined streams.</span>
            <span>This dashboard shows how a shared royalty pool could change that.</span>
          </p>
          <span className="story-link-pending" title="Add a YouTube or Loom URL to activate this link">Watch the 90-second story →</span>
        </section>

        <div className="dashboard-label"><span className="label-line" /> ARTIST DASHBOARD <span className="label-date">MY SON — BTM RECORDING ARTIST</span></div>

        <section className="hero rise" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-kicker"><Sparkles size={13} /> A NEW WAY TO THINK ABOUT ROYALTIES</div>
            <h1 id="hero-title">Your music has value.<br /><span>Let’s unlock it.</span></h1>
            <p>See how a shared royalty pool could help low-stream tracks participate in estimated royalty distributions.</p>
            <div className="hero-footnote"><Info size={14} /> This is a concept demonstration. No live royalty data or funds are connected.</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-center"><div className="sound-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><Music2 size={24} /></div>
            <div className="art-tag art-tag-top"><span className="art-pip" /> YOUR CATALOG</div>
            <div className="art-tag art-tag-bottom">VALUE IN MOTION <ArrowRight size={12} /></div>
          </div>
        </section>

        <section className="summary-grid rise rise-delay-1" aria-label="Artist summary">
          <article className="summary-card panel">
            <div className="summary-icon"><Music2 size={16} /></div>
            <div className="eyebrow">CATALOG STREAMS</div>
            <div className="summary-value mono" data-testid="text-total-streams">{math.totalStreams.toLocaleString()}</div>
            <div className="summary-caption">Across 5 sample tracks</div>
            <div className="tiny-bars" aria-hidden="true">{[38, 58, 92, 30, 72, 46, 80, 54, 67, 43, 84, 61, 95, 50, 70].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
          </article>
          <article className="summary-card panel">
            <div className="summary-icon icon-red"><CircleHelp size={16} /></div>
            <div className="eyebrow">BELOW ILLUSTRATIVE THRESHOLD</div>
            <div className="summary-value mono">{math.belowThresholdCount}<span className="summary-denom"> / {sampleTracks.length}</span></div>
            <div className="summary-caption">Tracks under {TRACK_THRESHOLD.toLocaleString()} streams</div>
          </article>
          <article className="summary-card panel summary-direct">
            <div className="summary-icon icon-muted"><Coins size={16} /></div>
            <div className="eyebrow">CURRENT DIRECT EARNINGS</div>
            <div className="summary-value mono">$0.00</div>
            <div className="summary-caption">Illustrative for 4 below-threshold tracks</div>
          </article>
        </section>

        <section className="section-block rise rise-delay-2" aria-labelledby="tracks-heading">
          <div className="section-heading">
            <div><div className="eyebrow">YOUR CATALOG</div><h2 id="tracks-heading">Track performance</h2></div>
            <div className="threshold-key"><span className="key-dot" /> Illustrative threshold <strong>{TRACK_THRESHOLD.toLocaleString()} streams</strong></div>
          </div>
          <div className="track-table panel">
            <div className="table-head"><span>TRACK</span><span>STREAMS</span><span>TO THRESHOLD</span><span>STATUS</span><span>DIRECT EARNINGS</span></div>
            {sampleTracks.map((track, index) => {
              const qualifies = track.streams >= TRACK_THRESHOLD;
              const progress = Math.min((track.streams / TRACK_THRESHOLD) * 100, 100);
              const remaining = Math.max(TRACK_THRESHOLD - track.streams, 0);
              return (
                <div className="track-row" key={track.name} data-testid={`row-track-${index}`}>
                  <div className="track-title"><span className="track-number">{String(index + 1).padStart(2, '0')}</span><Music2 size={15} /><strong>{track.name}</strong></div>
                  <div className="track-streams mono">{track.streams.toLocaleString()}</div>
                  <div className="track-progress" role="img" aria-label={`${track.name}: ${track.streams.toLocaleString()} of ${TRACK_THRESHOLD.toLocaleString()} illustrative streams, ${qualifies ? 'qualifying' : `${remaining.toLocaleString()} to threshold`}`}>
                    <div className="meter-track"><div className="meter-fill" style={{ width: `${progress}%`, background: qualifies ? '#52e982' : undefined }} /></div>
                    <span>{qualifies ? 'Threshold reached' : `${remaining.toLocaleString()} to go`}</span>
                  </div>
                  <div><span className={`status-pill ${qualifies ? 'status-qualifies' : 'status-below'}`}>{qualifies ? 'Qualifying' : 'Below threshold'}</span></div>
                  <div className="track-earnings mono">{qualifies ? '—' : '$0.00'}</div>
                </div>
              );
            })}
            <div className="track-mobile-list">
              {sampleTracks.map((track, index) => {
                const qualifies = track.streams >= TRACK_THRESHOLD;
                const progress = Math.min((track.streams / TRACK_THRESHOLD) * 100, 100);
                const remaining = Math.max(TRACK_THRESHOLD - track.streams, 0);
                return (
                  <article className="track-mobile-card" key={track.name} data-testid={`card-track-${index}`}>
                    <div className="mobile-track-top"><div className="track-title"><span className="track-number">{String(index + 1).padStart(2, '0')}</span><Music2 size={15} /><strong>{track.name}</strong></div><span className={`status-pill ${qualifies ? 'status-qualifies' : 'status-below'}`}>{qualifies ? 'Qualifying' : 'Below threshold'}</span></div>
                    <div className="mobile-stream-line"><span className="eyebrow">STREAMS</span><strong className="mono">{track.streams.toLocaleString()}</strong></div>
                    <div className="mobile-progress"><div className="meter-track" role="img" aria-label={`${track.name}: ${track.streams.toLocaleString()} of ${TRACK_THRESHOLD.toLocaleString()} illustrative streams`}><div className="meter-fill" style={{ width: `${progress}%` }} /></div><span>{qualifies ? 'Threshold reached' : `${remaining.toLocaleString()} to illustrative threshold`}</span></div>
                    <div className="mobile-earnings"><span>Current direct earnings</span><strong className="mono">{qualifies ? '—' : '$0.00'}</strong></div>
                  </article>
                );
              })}
            </div>
            <div className="table-foot"><Info size={13} /> Stream counts alone do not determine earnings. Platform rules vary.</div>
          </div>
        </section>

        <section className="section-block pool-section rise rise-delay-3" aria-labelledby="pool-heading">
          <div className="section-heading">
            <div><div className="eyebrow">BEYOND THE MUSIC</div><h2 id="pool-heading">From streams to shared value</h2></div>
            <span className="concept-badge"><span /> PROPOSED MODEL</span>
          </div>
          <div className="flow-card panel">
            <div className="flow-step artist-step">
              <div className="flow-symbol"><UsersRound size={18} /></div>
              <div className="eyebrow">01 / ARTISTS</div>
              <h3>Independent voices</h3>
              <p>Four illustrative contributors, building momentum together.</p>
              <div className="contributor-list">
                {poolContributors.map((person, index) => <div className="contributor" key={person.name}><div className={`contributor-avatar shade-${index}`}>{person.name.slice(-1)}</div><span>{person.name}</span><strong className="mono">{person.streams.toLocaleString()}</strong></div>)}
              </div>
              <div className="contributors-total"><span>Combined streams</span><strong className="mono">{math.contributorStreams.toLocaleString()}</strong></div>
            </div>
            <div className="flow-connector"><span className="connector-line" /><span className="connector-arrow"><ArrowRight size={15} /></span><small>POOL<br />TOGETHER</small></div>
            <div className="flow-step pool-center">
              <div className="pool-rings"><div className="pool-ring ring-a" /><div className="pool-ring ring-b" /><div className="pool-core"><UsersRound size={22} /></div></div>
              <div className="eyebrow">02 / COMMUNITY POOL</div>
              <h3>Shared participation</h3>
              <p>Contributors agree on the rules and share in verified revenue.</p>
              <div className="pool-stat"><span>Illustrative demo pool</span><strong className="mono">{formatMoney(demo.poolAmount)}</strong></div>
            </div>
            <div className="flow-connector flow-connector-last"><span className="connector-line" /><span className="connector-arrow"><ArrowRight size={15} /></span><small>SHARE BY<br />AGREEMENT</small></div>
            <div className="flow-step featured-step">
              <div className="featured-top"><div className="flow-symbol"><Sparkles size={18} /></div><span className="featured-label">MY SON</span></div>
              <div className="eyebrow">03 / ALLOCATION</div>
              <h3>My Son — BTM Recording Artist</h3>
              <p>An example share from the demo pool, shown in simulated USDC.</p>
              <div className="featured-amount mono">{formatMoney(math.allocation)} <span>USDC</span></div>
              <span className="estimate-label">Illustrative estimate — not actual or guaranteed royalties.</span>
              <button type="button" className="claim-button focus-ring" onClick={() => setConfirmOpen(true)} disabled={demo.claimed || math.allocation <= 0} data-testid="button-claim-usdc">
                {demo.claimed ? <><Check size={15} /> DEMO CLAIM RECORDED</> : <>CLAIM USDC <ArrowRight size={15} /></>}
              </button>
              {demo.claimed && <div className="claim-success"><Check size={13} /> Simulated claim complete</div>}
            </div>
          </div>
          <div className="demo-guard"><ShieldCheck size={15} /><span>USDC is simulated. No wallet connected and no real funds will be transferred.</span></div>
        </section>

        <section className="section-block activity-section" aria-labelledby="activity-heading">
          <div className="section-heading compact-heading"><div><div className="eyebrow">YOUR DEMO SESSION</div><h2 id="activity-heading">Activity history</h2></div></div>
          <div className="activity-card panel">
            {!demo.claimed ? (
              <div className="empty-activity">
                <div className="empty-icon"><Clock3 size={17} /></div>
                <strong>No demo activity yet</strong>
                <p>Confirm a simulated claim to see it recorded here.</p>
              </div>
            ) : (
              <div className="activity-item" data-testid="status-claim-activity">
                <div className="activity-check"><Check size={14} /></div>
                <div className="activity-description"><strong>Simulated allocation claimed</strong><span>{demo.claimedAt ? new Date(demo.claimedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Demo session'}</span></div>
                <div className="activity-amount"><strong className="mono">{formatMoney(demo.claimedAmount)}</strong><span>USDC simulated</span></div>
              </div>
            )}
            <div className="balance-line"><span><WalletCards size={14} /> Remaining simulated balance</span><strong className="mono">{formatMoney(remainingBalance)} <small>USDC</small></strong></div>
            {claimMessage && <div className="claim-message" role="status"><Check size={14} /> {claimMessage}</div>}
          </div>
        </section>

        <section className="lower-grid">
          <div className="section-block settings-section" aria-labelledby="settings-heading">
            <div className="section-heading compact-heading"><div><div className="eyebrow">PLAY WITH THE NUMBERS</div><h2 id="settings-heading">Demo settings</h2></div><span className="settings-mark"><RotateCcw size={14} /> EDITABLE</span></div>
            <div className="settings-card panel">
              <p className="settings-intro">Change the assumptions to see how the illustrative allocation responds. These are demo inputs only.</p>
              <label className="setting-field" htmlFor="pool-amount">
                <span><strong>Demo pool amount</strong><small>Simulated pool value in USD</small></span>
                <span className="input-wrap"><span>$</span><input id="pool-amount" type="number" min="0" step="0.01" value={demo.poolAmount} onChange={(event) => updateAmount(event.target.value)} data-testid="input-pool-amount" /></span>
              </label>
              <label className="setting-field" htmlFor="allocation-percent">
                <span><strong>Featured artist allocation</strong><small>Example share of the pool</small></span>
                <span className="input-wrap percent-input"><input id="allocation-percent" type="number" min="0" max="100" step="1" value={demo.allocationPercent} onChange={(event) => updatePercent(event.target.value)} data-testid="input-allocation-percent" /><span>%</span></span>
              </label>
              <div className="settings-result"><span>Estimated share</span><strong className="mono">{formatMoney(math.allocation)} <small>USDC simulated</small></strong></div>
              <button type="button" className="reset-button focus-ring" onClick={resetDemo} data-testid="button-reset-demo"><RotateCcw size={14} /> Reset demo</button>
              {resetMessage && <p className="inline-feedback" role="status">Demo settings restored. You can claim the sample allocation again.</p>}
            </div>
          </div>
          <div className="section-block how-section" aria-labelledby="how-heading">
            <div className="section-heading compact-heading"><div><div className="eyebrow">THE IDEA, IN THREE STEPS</div><h2 id="how-heading">How it could work</h2></div></div>
            <div className="steps-card panel">
              <div className="how-step"><span className="step-index">01</span><div><strong>Combine eligible activity</strong><p>Participating artists agree to combine eligible activity.</p></div><ChevronRight size={16} /></div>
              <div className="how-step"><span className="step-index">02</span><div><strong>Calculate an agreed allocation</strong><p>Artists decide how verified revenue will be shared.</p></div><ChevronRight size={16} /></div>
              <div className="how-step"><span className="step-index">03</span><div><strong>Distribute verified funds</strong><p>Funds are distributed under the agreed rules.</p></div><ChevronRight size={16} /></div>
              <div className="steps-note"><Info size={14} /> Pooling is proposed—not a live service. It needs willing participants, agreed rules, verified revenue, and platform or distributor arrangements.</div>
            </div>
          </div>
        </section>

        <section className="section-block" aria-labelledby="comparison-heading">
          <div className="section-heading compact-heading"><div><div className="eyebrow">A DIFFERENT LENS</div><h2 id="comparison-heading">Individual vs. pooled</h2></div></div>
          <div className="comparison-card panel">
            <div className="comparison-head"><div /><span>WITHOUT POOLING</span><span>WITH HYPOTHETICAL POOLING</span></div>
            <div className="comparison-row"><div className="comparison-topic">Estimated payout</div><div>$0.00<br /><small>Four below-threshold sample tracks in this demo</small></div><div className="comparison-highlight"><strong className="mono">{formatMoney(math.allocation)} USDC</strong><br /><small>Illustrative artist allocation</small></div></div>
            <div className="comparison-row"><div className="comparison-topic">Focus</div><div>One track at a time</div><div className="comparison-highlight">Participating artists together</div></div>
            <div className="comparison-row"><div className="comparison-topic">Eligibility</div><div>Platform rules vary</div><div className="comparison-highlight">Agreed pool rules</div></div>
            <div className="comparison-row"><div className="comparison-topic">What it means</div><div>Streams are not a payout</div><div className="comparison-highlight">Verified revenue is shared</div></div>
            <div className="comparison-note">A concept comparison, not a recommendation or promise of earnings.</div>
          </div>
        </section>

        <section className="roadmap-section" aria-labelledby="roadmap-heading">
          <div className="section-heading">
            <div>
              <div className="eyebrow">FUTURE CONCEPT</div>
              <h2 id="roadmap-heading">Coming soon: on-chain architecture</h2>
            </div>
            <span className="roadmap-badge"><span /> ROADMAP · NOT ACTIVE</span>
          </div>
          <div className="roadmap-panel panel">
            <p className="roadmap-intro">A plain-language look at how a future royalty pool could work on-chain. These are roadmap ideas, not features available in this demo.</p>
            <div className="roadmap-grid">
              <article className="roadmap-item">
                <div className="roadmap-icon"><Coins size={16} /></div>
                <strong>USDC on Solana</strong>
                <p>Future distributions could use USDC, a digital currency designed to track the U.S. dollar, on the Solana network.</p>
              </article>
              <article className="roadmap-item">
                <div className="roadmap-icon"><Zap size={16} /></div>
                <strong>Instant settlement</strong>
                <p>Once a distribution is verified and approved, a future transfer could settle quickly on the network.</p>
              </article>
              <article className="roadmap-item">
                <div className="roadmap-icon"><ScanEye size={16} /></div>
                <strong>Transparent ledger</strong>
                <p>Shared on-chain transaction records could let participants verify that a distribution was made.</p>
              </article>
              <article className="roadmap-item">
                <div className="roadmap-icon"><WalletCards size={16} /></div>
                <strong>Wallet connect</strong>
                <p>A future option could let artists connect a compatible wallet to receive an approved distribution.</p>
              </article>
            </div>
            <div className="roadmap-notice"><Info size={14} /> No wallet connection, Solana transactions, real-time settlement, or live ledger is available in this demo.</div>
          </div>
        </section>

        <section className="section-block solana-section" aria-labelledby="solana-heading">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ROADMAP RATIONALE</div>
              <h2 id="solana-heading">Why Solana</h2>
            </div>
            <span className="roadmap-badge"><span /> PROPOSED · NOT ACTIVE</span>
          </div>
          <div className="solana-panel panel">
            <p>Micro-payments at 800-stream scale only work when transaction fees are fractions of a cent. Solana makes instant USDC settlement economically possible.</p>
          </div>
        </section>

        <section className="caveat-panel" aria-label="Important context">
          <div className="caveat-icon"><Info size={17} /></div>
          <div className="caveat-copy">
            <strong>Important context</strong>
            <p>Thresholds shown here are illustrative; platform rules vary. Stream counts alone do not determine earnings. Actual earnings depend on revenue received, rights ownership, agreements, fees, and the distribution formula. Pooling is a proposed concept that would require participants, agreed rules, verified revenue, and platform or distributor arrangements.</p>
          </div>
          <div className="caveat-tag">DEMO ONLY</div>
        </section>

        <footer className="footer">
          <div className="footer-brand"><div className="brand-mark brand-mark-small"><span>BTM</span><span className="brand-wave" aria-hidden="true"><i /><i /><i /></span></div><span>BEYOND THE MUSIC</span></div>
          <p>Illustrative demonstration only. Not a royalty statement, payout offer, or guarantee.</p>
          <div className="footer-status"><span /> DEMO MODE — NO WALLET CONNECTED</div>
        </footer>
      </div>

      {confirmOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmOpen(false); }}>
          <section className="claim-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <button type="button" className="dialog-close focus-ring" aria-label="Close confirmation" onClick={() => setConfirmOpen(false)}><X size={18} /></button>
            <div className="dialog-icon"><WalletCards size={21} /></div>
            <div className="eyebrow">SIMULATED DEMO CLAIM</div>
            <h2 id="dialog-title">Review your example allocation</h2>
            <p id="dialog-description">This records a simulated claim in this browser only. No wallet or payment network is involved.</p>
            <div className="dialog-amount"><span>Estimated allocation</span><strong className="mono">{formatMoney(math.allocation)} <small>USDC</small></strong></div>
            <div className="dialog-disclaimer"><ShieldCheck size={15} /><span>Illustrative estimate — not actual or guaranteed royalties.</span></div>
            <button type="button" className="dialog-confirm focus-ring" onClick={confirmClaim} data-testid="button-confirm-demo-claim"><Check size={16} /> Confirm Demo Claim</button>
            <button type="button" className="dialog-cancel focus-ring" onClick={() => setConfirmOpen(false)} data-testid="button-cancel-demo-claim">Cancel</button>
            <small className="dialog-safe-note">No credentials requested. No real funds will be transferred.</small>
          </section>
        </div>
      )}

      <div className="live-demo-banner"><span className="banner-pulse" /> Demo mode — no wallet connected and no real funds will be transferred.</div>
    </main>
  );
}

export default App;
