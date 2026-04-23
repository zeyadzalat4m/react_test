import { useTranslation } from 'react-i18next';
import { useItems } from '../../hooks/useItems';
import { useOrders } from '../../hooks/useOrders';
import { useSuppliers } from '../../hooks/useSuppliers';

function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { data: itemsData } = useItems({ limit: 100 });
  const { data: ordersData } = useOrders({ limit: 100 });
  const { data: suppliersData } = useSuppliers({ limit: 100 });

  const items = itemsData?.data || [];
  const orders = ordersData?.data || [];
  const suppliers = suppliersData?.data || [];

  const totalItems = items.length;
  const lowStock = items.filter((item: any) => item.quantity <= item.min_stock_level).length;
  const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;
  const totalSuppliers = suppliers.length;

  const recentOrders = orders.slice(0, 5);

  const isRTL = i18n.language === 'ar';

  return (
    <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('warehouseDashboard')}</h1>
        <p className={`mt-2 text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t('dashboardOverview')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 bg-primary-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t('totalItems')}</p>
              <p className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t('lowStockItems')}</p>
              <p className={`text-2xl font-bold text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{lowStock}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t('pendingOrders')}</p>
              <p className={`text-2xl font-bold text-yellow-600 ${isRTL ? 'text-right' : 'text-left'}`}>{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🚚</span>
            </div>
            <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
              <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t('totalSuppliers')}</p>
              <p className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{totalSuppliers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-xl font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('recentOrders')}</h2>
          <a href="/orders" className={`text-primary-600 hover:text-primary-700 text-sm font-medium ${isRTL ? 'text-left' : 'text-right'}`}>
            View all →
          </a>
        </div>
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order: any) => (
              <div key={order.id} className={`flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className={`text-sm font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {order.type === 'incoming' ? '📥' : '📤'} Order #{order.id}
                  </p>
                  <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {order.items.length} items • ${order.total_amount.toFixed(2)}
                  </p>
                </div>
                <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className={`text-gray-500 text-center py-8 ${isRTL ? 'text-right' : 'text-left'}`}>No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
