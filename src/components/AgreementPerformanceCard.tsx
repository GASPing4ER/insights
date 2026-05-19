import type { AgreementPerformance, AgreementStatus, AgreementType } from '../types/insights';
import { Sparkline } from './Sparkline';
import './AgreementPerformanceCard.css';

const TYPE_LABELS: Record<AgreementType, string> = {
  volume: 'Volume',
  tiered: 'Tiered',
  market_share: 'Market Share',
  outcomes_based: 'Outcomes',
  flat_fee: 'Flat Fee',
};

const STATUS_LABELS: Record<AgreementStatus, string> = {
  on_track: 'On Track',
  at_risk: 'At Risk',
  underperforming: 'Underperforming',
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

interface AgreementPerformanceCardProps {
  agreement: AgreementPerformance;
}

export function AgreementPerformanceCard({ agreement }: AgreementPerformanceCardProps) {
  const {
    agreementName,
    type,
    productName,
    payerName,
    attainmentPct,
    projectedAttainmentPct,
    maxRebateValue,
    currentRebateOnTrack,
    status,
    historicalPerformance,
    tierInfo,
    periodEnd,
  } = agreement;

  const sparklineData = historicalPerformance.map((h) => h.attainmentPct);
  const sparklineColor =
    status === 'on_track' ? '#10b981' : status === 'at_risk' ? '#f59e0b' : '#ef4444';

  const cappedAttainment = Math.min(attainmentPct, 100);
  const cappedProjected = Math.min(projectedAttainmentPct, 100);

  return (
    <article className={`apc apc--${status}`}>
      <header className="apc__header">
        <div className="apc__title-group">
          <span className={`apc__type-badge apc__type-badge--${type}`}>{TYPE_LABELS[type]}</span>
          <h3 className="apc__name">{agreementName}</h3>
          <p className="apc__meta">
            {productName} · {payerName} · ends {periodEnd}
          </p>
        </div>
        <span className={`apc__status-badge apc__status-badge--${status}`}>
          <span className="apc__status-dot" />
          {STATUS_LABELS[status]}
        </span>
      </header>

      <div className="apc__progress-section">
        <div className="apc__progress-labels">
          <span className="apc__progress-pct">{attainmentPct}%</span>
          <span className="apc__progress-label">of target attained</span>
        </div>
        <div className="apc__progress-track" role="progressbar" aria-valuenow={attainmentPct} aria-valuemin={0} aria-valuemax={100}>
          <div className={`apc__progress-fill apc__progress-fill--${status}`} style={{ width: `${cappedAttainment}%` }} />
          {projectedAttainmentPct > attainmentPct && (
            <div
              className="apc__progress-projected"
              style={{ width: `${cappedProjected - cappedAttainment}%`, left: `${cappedAttainment}%` }}
              title={`Projected: ${projectedAttainmentPct}%`}
            />
          )}
          <div className="apc__progress-target-line" title="Target (100%)" />
        </div>
        <div className="apc__progress-sublabels">
          <span>0%</span>
          {projectedAttainmentPct > attainmentPct && (
            <span className="apc__projected-label">
              Projected {projectedAttainmentPct}% (est.)
            </span>
          )}
          <span>100%</span>
        </div>
      </div>

      <div className="apc__financials">
        <div className="apc__financial-item">
          <span className="apc__financial-label">Max rebate</span>
          <span className="apc__financial-value">{fmt(maxRebateValue)}</span>
        </div>
        <div className="apc__financial-item">
          <span className="apc__financial-label">On track to earn</span>
          <span className={`apc__financial-value apc__financial-value--${status}`}>
            {fmt(currentRebateOnTrack)}
          </span>
        </div>
        <div className="apc__financial-item">
          <span className="apc__financial-label">Value at stake</span>
          <span className="apc__financial-value apc__financial-value--stake">
            {fmt(maxRebateValue - currentRebateOnTrack)}
          </span>
        </div>
      </div>

      {tierInfo && (
        <div className="apc__tier-info">
          <p className="apc__tier-current">
            <strong>Current tier:</strong> {tierInfo.currentTierLabel} · {tierInfo.currentTierRebatePct}% rebate
          </p>
          {tierInfo.nextTierThreshold && (
            <p className="apc__tier-next">
              Next tier at {tierInfo.nextTierThreshold.toLocaleString()} units → {tierInfo.nextTierRebatePct}% rebate
            </p>
          )}
          <div className="apc__tier-bars">
            {tierInfo.incrementalRebateByTier.map((t) => (
              <div key={t.tier} className={`apc__tier-bar ${t.tier <= tierInfo.currentTier ? 'apc__tier-bar--reached' : ''}`}>
                <span className="apc__tier-bar-label">{t.label}</span>
                <span className="apc__tier-bar-value">{fmt(t.rebateValue)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="apc__footer">
        <div className="apc__trend">
          <span className="apc__trend-label">6-month trend</span>
          <Sparkline data={sparklineData} color={sparklineColor} />
        </div>
        <div className="apc__trend-periods">
          {historicalPerformance.map((h) => (
            <span key={h.period} className="apc__trend-period">{h.period.split(' ')[0]}</span>
          ))}
        </div>
      </footer>
    </article>
  );
}
