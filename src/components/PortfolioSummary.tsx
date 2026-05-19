import type { PortfolioSummaryData } from '../types/insights';
import './PortfolioSummary.css';

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

interface PortfolioSummaryProps {
  data: PortfolioSummaryData;
}

export function PortfolioSummary({ data }: PortfolioSummaryProps) {
  const { totalActiveAgreements, totalContractedRebateValue, totalIdentifiedRebateValue, totalRebateAtStake, statusCounts } = data;

  return (
    <div className="portfolio-summary">
      <div className="ps-card">
        <span className="ps-card__label">Active Agreements</span>
        <span className="ps-card__value">{totalActiveAgreements}</span>
        <div className="ps-status-pills">
          <span className="ps-pill ps-pill--on_track">{statusCounts.on_track} on track</span>
          <span className="ps-pill ps-pill--at_risk">{statusCounts.at_risk} at risk</span>
          <span className="ps-pill ps-pill--underperforming">{statusCounts.underperforming} under</span>
        </div>
      </div>

      <div className="ps-card">
        <span className="ps-card__label">Total Contracted Value</span>
        <span className="ps-card__value">{fmt(totalContractedRebateValue)}</span>
        <span className="ps-card__sub">across all active agreements</span>
      </div>

      <div className="ps-card">
        <span className="ps-card__label">Identified Rebates</span>
        <span className="ps-card__value ps-card__value--positive">{fmt(totalIdentifiedRebateValue)}</span>
        <span className="ps-card__sub">{Math.round((totalIdentifiedRebateValue / totalContractedRebateValue) * 100)}% of contracted value</span>
      </div>

      <div className="ps-card">
        <span className="ps-card__label">Value at Stake</span>
        <span className="ps-card__value ps-card__value--warning">{fmt(totalRebateAtStake)}</span>
        <span className="ps-card__sub">unearned rebate value</span>
      </div>
    </div>
  );
}
