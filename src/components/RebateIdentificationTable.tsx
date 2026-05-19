import type { RebateIdentificationItem, AgreementType } from '../types/insights';
import './RebateIdentificationTable.css';

const TYPE_LABELS: Record<AgreementType, string> = {
  volume: 'Volume',
  tiered: 'Tiered',
  market_share: 'Market Share',
  outcomes_based: 'Outcomes',
  flat_fee: 'Flat Fee',
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

interface RebateIdentificationTableProps {
  items: RebateIdentificationItem[];
}

export function RebateIdentificationTable({ items }: RebateIdentificationTableProps) {
  return (
    <div className="rit">
      <div className="rit__header">
        <div>
          <h2 className="rit__title">Rebate Identification</h2>
          <p className="rit__sub">Identified rebate values vs contractually expected amounts per agreement and period.</p>
        </div>
        <span className="rit__indicative">All values indicative</span>
      </div>

      <div className="rit__table-wrap">
        <table className="rit__table">
          <thead>
            <tr>
              <th>Agreement</th>
              <th>Product</th>
              <th>Payer</th>
              <th>Type</th>
              <th>Period</th>
              <th>Identified</th>
              <th>Expected</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const positive = item.variancePct >= 0;
              return (
                <tr key={`${item.agreementId}-${i}`}>
                  <td className="rit__td-agreement">{item.agreementName.split('—')[0].trim()}</td>
                  <td>{item.productName}</td>
                  <td>{item.payerName}</td>
                  <td>
                    <span className={`rit__type-tag rit__type-tag--${item.type}`}>
                      {TYPE_LABELS[item.type]}
                    </span>
                  </td>
                  <td>{item.period}</td>
                  <td className="rit__td-value">{fmt(item.identifiedValue)}</td>
                  <td className="rit__td-value rit__td-expected">{fmt(item.expectedValue)}</td>
                  <td>
                    <span className={`rit__variance ${positive ? 'rit__variance--positive' : 'rit__variance--negative'}`}>
                      {positive ? '+' : ''}{item.variancePct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
