import "./CartCheckout.css";
import { ordersData } from "../../services/api";

export default function CartCheckout() {
  return (
    <div className="orders-card">
      <div className="orders-header">
        <h3>Recent Orders</h3>
        <span>{ordersData.length} orders</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map(o => (
              <tr key={o.id}>
                <td className="order-id">{o.id}</td>
                <td className="order-name">{o.customer}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {o.items}
                </td>
                <td className="order-total">${o.total.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${o.status}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </td>
                <td className="order-time">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
