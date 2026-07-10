import { useState, useEffect } from 'react';
import { FiShoppingBag, FiFilter, FiEye, FiEdit, FiLoader } from 'react-icons/fi';
import { adminService } from '../services/adminService.js';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready_for_pickup: 'bg-purple-100 text-purple-800',
    delivering: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOrders(statusFilter);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminService.getOrderStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const order = await adminService.getOrderById(orderId);
      setSelectedOrder(order);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      await fetchStats();
      if (selectedOrder && selectedOrder.order_id === orderId) {
        const updatedOrder = await adminService.getOrderById(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Order & Delivery Management</h2>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">${stats.totalRevenue?.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.byStatus?.pending || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.byStatus?.completed || 0}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <FiFilter className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready_for_pickup">Ready for Pickup</option>
            <option value="delivering">Delivering</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <FiLoader className="animate-spin text-2xl text-gray-400" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">#{order.order_id}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{order.users?.username || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{order.restaurants?.name || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">${parseFloat(order.total_price).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.order_status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.order_status?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(order.ordered_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleViewOrder(order.order_id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">Order #{selectedOrder.order_id}</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{selectedOrder.users?.username} ({selectedOrder.users?.email})</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Restaurant</p>
                  <p className="font-medium">{selectedOrder.restaurants?.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.restaurants?.address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-medium">{selectedOrder.delivery_address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Order Items</p>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.order_item_id} className="flex justify-between text-sm">
                        <span>{item.food_items?.name} x{item.quantity}</span>
                        <span>${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${parseFloat(selectedOrder.delivery_fee).toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${parseFloat(selectedOrder.discount_amount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>${parseFloat(selectedOrder.total_price).toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(statusColors).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.order_id, status)}
                        disabled={selectedOrder.order_status === status}
                        className={`px-3 py-1 text-sm rounded-full ${
                          selectedOrder.order_status === status
                            ? statusColors[status]
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
