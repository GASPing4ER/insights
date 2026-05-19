import { useState } from 'react';
import type { AgreementStatus } from '../types/insights';
import { MOCK_DATA, TENANTS } from '../data/mockData';
import { PortfolioSummary } from '../components/PortfolioSummary';
import { AgreementTypeBreakdown } from '../components/AgreementTypeBreakdown';
import { AgreementPerformanceCard } from '../components/AgreementPerformanceCard';
import { RebateIdentificationTable } from '../components/RebateIdentificationTable';
import './InsightsDashboard.css';

type Tab = 'performance' | 'structure' | 'rebates';
type StatusFilter = 'all' | AgreementStatus;

const TABS: { id: Tab; label: string }[] = [
  { id: 'performance', label: 'Agreement Performance' },
  { id: 'structure', label: 'Types & Structure' },
  { id: 'rebates', label: 'Rebate Identification' },
];

export function InsightsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('performance');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedTenant, setSelectedTenant] = useState(TENANTS[0].id);

  const tenant = TENANTS.find((t) => t.id === selectedTenant)!;
  const data = MOCK_DATA;

  const filteredAgreements =
    statusFilter === 'all'
      ? data.agreements
      : data.agreements.filter((a) => a.status === statusFilter);

  return (
    <div className="dashboard">
      {/* Top bar */}
      <header className="dashboard__topbar">
        <div className="dashboard__brand">
          <span className="dashboard__brand-logo">L</span>
          <div>
            <span className="dashboard__brand-name">Lyfegen</span>
            <span className="dashboard__brand-module">Insights</span>
          </div>
        </div>

        <div className="dashboard__tenant-selector">
          <label htmlFor="tenant-select" className="dashboard__tenant-label">Viewing as</label>
          <select
            id="tenant-select"
            className="dashboard__tenant-select"
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
          >
            {TENANTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.role})
              </option>
            ))}
          </select>
          <span className={`dashboard__role-badge dashboard__role-badge--${tenant.role}`}>
            {tenant.role}
          </span>
        </div>

        <div className="dashboard__meta">
          <span className="dashboard__as-of">Data as of {data.portfolio.asOf}</span>
          <span className="dashboard__refresh-note">Refreshes nightly</span>
        </div>
      </header>

      {/* Page header */}
      <div className="dashboard__page-header">
        <div>
          <h1 className="dashboard__title">Rebate Insights</h1>
          <p className="dashboard__subtitle">{data.portfolio.tenantName} · Portfolio overview</p>
        </div>
        <div className="dashboard__disclaimer">
          All values are indicative. Final rebate amounts confirmed at reconciliation only.
        </div>
      </div>

      {/* Portfolio KPIs */}
      <section className="dashboard__section">
        <PortfolioSummary data={data.portfolio} />
      </section>

      {/* Tabs */}
      <nav className="dashboard__tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`dashboard__tab ${activeTab === tab.id ? 'dashboard__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab: Performance */}
      {activeTab === 'performance' && (
        <section className="dashboard__section" role="tabpanel">
          <div className="dashboard__filters">
            <span className="dashboard__filters-label">Filter by status:</span>
            {(['all', 'on_track', 'at_risk', 'underperforming'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                className={`dashboard__filter-btn dashboard__filter-btn--${s} ${statusFilter === s ? 'dashboard__filter-btn--active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All' : s === 'on_track' ? 'On Track' : s === 'at_risk' ? 'At Risk' : 'Underperforming'}
                {s !== 'all' && (
                  <span className="dashboard__filter-count">
                    {data.agreements.filter((a) => a.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredAgreements.length === 0 ? (
            <p className="dashboard__empty">No agreements match the selected filter.</p>
          ) : (
            <div className="dashboard__cards">
              {filteredAgreements.map((agreement) => (
                <AgreementPerformanceCard key={agreement.agreementId} agreement={agreement} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab: Structure */}
      {activeTab === 'structure' && (
        <section className="dashboard__section" role="tabpanel">
          <AgreementTypeBreakdown items={data.typeBreakdown} />
        </section>
      )}

      {/* Tab: Rebate Identification */}
      {activeTab === 'rebates' && (
        <section className="dashboard__section" role="tabpanel">
          <RebateIdentificationTable items={data.rebateIdentification} />
        </section>
      )}
    </div>
  );
}
