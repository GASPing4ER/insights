import type { AgreementTypeBreakdownItem, AgreementType } from '../types/insights';
import './AgreementTypeBreakdown.css';

const TYPE_LABELS: Record<AgreementType, string> = {
  volume: 'Volume-Based',
  tiered: 'Tiered',
  market_share: 'Market Share',
  outcomes_based: 'Outcomes-Based',
  flat_fee: 'Flat Fee',
};

const TYPE_COLORS: Record<AgreementType, string> = {
  volume: '#3b82f6',
  tiered: '#8b5cf6',
  market_share: '#0d9488',
  outcomes_based: '#f97316',
  flat_fee: '#9ca3af',
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

interface AgreementTypeBreakdownProps {
  items: AgreementTypeBreakdownItem[];
}

export function AgreementTypeBreakdown({ items }: AgreementTypeBreakdownProps) {
  const total = items.reduce((s, i) => s + i.totalContractedValue, 0);

  return (
    <div className="atb">
      <h2 className="atb__title">Agreement Types & Portfolio Composition</h2>
      <p className="atb__sub">Breakdown of active agreements by type, showing products covered and contracted rebate value.</p>

      <div className="atb__stacked-bar">
        {items.map((item) => (
          <div
            key={item.type}
            className="atb__bar-segment"
            style={{
              width: `${(item.totalContractedValue / total) * 100}%`,
              background: TYPE_COLORS[item.type],
            }}
            title={`${TYPE_LABELS[item.type]}: ${fmt(item.totalContractedValue)}`}
          />
        ))}
      </div>

      <div className="atb__legend">
        {items.map((item) => (
          <div key={item.type} className="atb__legend-item">
            <span className="atb__legend-dot" style={{ background: TYPE_COLORS[item.type] }} />
            <span className="atb__legend-label">{TYPE_LABELS[item.type]}</span>
          </div>
        ))}
      </div>

      <table className="atb__table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Agreements</th>
            <th>Products</th>
            <th>Contracted Value</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.type}>
              <td>
                <span className="atb__type-dot" style={{ background: TYPE_COLORS[item.type] }} />
                {TYPE_LABELS[item.type]}
              </td>
              <td>{item.count}</td>
              <td>{item.products}</td>
              <td>{fmt(item.totalContractedValue)}</td>
              <td>
                <div className="atb__share-bar">
                  <div
                    className="atb__share-fill"
                    style={{
                      width: `${(item.totalContractedValue / total) * 100}%`,
                      background: TYPE_COLORS[item.type],
                    }}
                  />
                </div>
                <span className="atb__share-pct">{Math.round((item.totalContractedValue / total) * 100)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>{items.reduce((s, i) => s + i.count, 0)}</strong></td>
            <td><strong>{items.reduce((s, i) => s + i.products, 0)}</strong></td>
            <td><strong>{fmt(total)}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
