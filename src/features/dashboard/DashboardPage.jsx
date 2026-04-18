import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography, Box, Chip, List, ListItem, ListItemText } from '@mui/material';
import AppShell from '../../components/AppShell.jsx';
import { fetchInventory } from '../inventory/inventorySlice.js';
import { fetchOrders } from '../orders/ordersSlice.js';
import { fetchSuppliers } from '../suppliers/suppliersSlice.js';

function DashboardPage() {
  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory);
  const orders = useSelector((state) => state.orders);
  const suppliers = useSelector((state) => state.suppliers);

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchOrders());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const totalItems = inventory.items.length;
  const lowStock = inventory.items.filter((item) => item.quantity <= 5).length;
  const pendingOrders = orders.orders.filter((order) => order.status === 'Pending').length;
  const completedOrders = orders.orders.filter((order) => order.status === 'Completed').length;

  const recentActivity = [
    ...orders.orders.slice(0, 3).map((order) => ({
      id: order.id,
      title: `${order.type} order for ${order.product}`,
      subtitle: order.status,
      time: order.createdAt
    })),
    ...suppliers.suppliers.slice(0, 2).map((supplier) => ({
      id: supplier.id,
      title: `Supplier ${supplier.name} updated`,
      subtitle: supplier.category,
      time: Date.now() - 1000 * 60 * 20
    }))
  ].sort((a, b) => b.time - a.time);

  return (
    <AppShell>
      <Typography variant="h4" gutterBottom>
        Warehouse Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Total inventory items
            </Typography>
            <Typography variant="h3" mt={1}>
              {totalItems}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Low stock alerts
            </Typography>
            <Typography variant="h3" mt={1}>
              {lowStock}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Pending orders
            </Typography>
            <Typography variant="h3" mt={1}>
              {pendingOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Completed orders
            </Typography>
            <Typography variant="h3" mt={1}>
              {completedOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.length === 0 ? (
                <Typography color="text.secondary">No recent events.</Typography>
              ) : (
                recentActivity.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.subtitle}
                    />
                    <Chip label={activity.subtitle} size="small" />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep an eye on low stock items and process incoming orders first.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </AppShell>
  );
}

export default DashboardPage;
