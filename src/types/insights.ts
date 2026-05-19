export type AgreementType = 'volume' | 'tiered' | 'market_share' | 'outcomes_based' | 'flat_fee';

export type AgreementStatus = 'on_track' | 'at_risk' | 'underperforming';

export interface TierInfo {
  currentTier: number;
  totalTiers: number;
  currentTierLabel: string;
  currentTierRebatePct: number;
  nextTierThreshold: number | null;
  nextTierRebatePct: number | null;
  incrementalRebateByTier: { tier: number; label: string; rebateValue: number }[];
}

export interface HistoricalPeriod {
  period: string;
  attainmentPct: number;
  rebateValue: number;
}

export interface AgreementPerformance {
  agreementId: string;
  agreementName: string;
  type: AgreementType;
  productName: string;
  payerName: string;
  periodStart: string;
  periodEnd: string;
  targetThreshold: number;
  currentAttainment: number;
  attainmentPct: number;
  projectedAttainment: number;
  projectedAttainmentPct: number;
  maxRebateValue: number;
  identifiedRebateValue: number;
  expectedRebateValue: number;
  currentRebateOnTrack: number;
  status: AgreementStatus;
  historicalPerformance: HistoricalPeriod[];
  tierInfo: TierInfo | null;
}

export interface AgreementTypeBreakdownItem {
  type: AgreementType;
  label: string;
  count: number;
  products: number;
  totalContractedValue: number;
}

export interface RebateIdentificationItem {
  agreementId: string;
  agreementName: string;
  productName: string;
  payerName: string;
  type: AgreementType;
  period: string;
  identifiedValue: number;
  expectedValue: number;
  variancePct: number;
}

export interface PortfolioSummaryData {
  tenantId: string;
  tenantName: string;
  asOf: string;
  totalActiveAgreements: number;
  totalContractedRebateValue: number;
  totalIdentifiedRebateValue: number;
  totalRebateAtStake: number;
  statusCounts: { on_track: number; at_risk: number; underperforming: number };
}

export interface InsightsDashboardData {
  portfolio: PortfolioSummaryData;
  agreements: AgreementPerformance[];
  typeBreakdown: AgreementTypeBreakdownItem[];
  rebateIdentification: RebateIdentificationItem[];
}
