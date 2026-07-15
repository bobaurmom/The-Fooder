import { supabase } from '../../supabaseClient.js';
import { rolePermissionService } from './rolePermissionService.js';

export const adminService = {
  async createBackup() {
    try {
      const timestamp = new Date().toISOString();
      const backupData = {
        timestamp,
        version: '1.0',
        tables: {}
      };

      // List of tables to backup
      const tables = [
        'users',
        'user_preferences',
        'restaurant_users',
        'restaurants',
        'food_items',
        'tags',
        'food_tags',
        'swipe_logs',
        'cart_items',
        'promotions',
        'user_coupons',
        'orders',
        'order_items'
      ];

      // Fetch data from each table
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (error) {
          console.warn(`Warning: Could not backup table ${table}:`, error.message);
          backupData.tables[table] = [];
        } else {
          backupData.tables[table] = data || [];
        }
      }

      return {
        timestamp,
        data: JSON.stringify(backupData, null, 2)
      };
    } catch (error) {
      console.error('BACKUP SERVICE ERROR:', error);
      throw new Error('Failed to create database backup');
    }
  },

  async restoreBackup(file) {
    try {
      const backupContent = file.buffer.toString('utf-8');
      const backupData = JSON.parse(backupContent);

      if (!backupData.tables) {
        throw new Error('Invalid backup file format');
      }

      const restoreResults = {
        restored: [],
        failed: [],
        totalRecords: 0
      };

      // Restore each table
      for (const [tableName, records] of Object.entries(backupData.tables)) {
        if (!Array.isArray(records) || records.length === 0) {
          continue;
        }

        try {
          // Delete existing data (be careful with this in production)
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .neq('user_id', 0); // This is a workaround to delete all

          if (deleteError && deleteError.code !== 'PGRST116') {
            console.warn(`Warning: Could not clear table ${tableName}:`, deleteError.message);
          }

          // Insert backup data
          const { error: insertError } = await supabase
            .from(tableName)
            .insert(records);

          if (insertError) {
            restoreResults.failed.push({
              table: tableName,
              error: insertError.message
            });
          } else {
            restoreResults.restored.push({
              table: tableName,
              records: records.length
            });
            restoreResults.totalRecords += records.length;
          }
        } catch (error) {
          restoreResults.failed.push({
            table: tableName,
            error: error.message
          });
        }
      }

      return restoreResults;
    } catch (error) {
      console.error('RESTORE SERVICE ERROR:', error);
      throw new Error('Failed to restore database backup');
    }
  },

  // Order & Delivery Management
  async getAllOrders(status, page = 1, limit = 20) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          users:user_id(username, email),
          restaurants:restaurant_id(name, address)
        `)
        .range((page - 1) * limit, page * limit - 1)
        .order('ordered_at', { ascending: false });

      if (status) {
        query = query.eq('order_status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error fetching orders:', error);
        return {
          orders: [],
          page,
          limit
        };
      }

      return {
        orders: data || [],
        page,
        limit
      };
    } catch (error) {
      console.error('GET ALL ORDERS SERVICE ERROR:', error);
      return {
        orders: [],
        page,
        limit
      };
    }
  },

  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users:user_id(username, email),
          restaurants:restaurant_id(name, address),
          order_items(*, food_items:food_id(name, price))
        `)
        .eq('order_id', orderId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('GET ORDER BY ID SERVICE ERROR:', error);
      throw new Error('Failed to fetch order');
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('order_id', orderId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('UPDATE ORDER STATUS SERVICE ERROR:', error);
      throw new Error('Failed to update order status');
    }
  },

  async getOrderStats() {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('order_status, total_price, ordered_at');

      if (ordersError) {
        console.error('Supabase error fetching orders:', ordersError);
        // Return empty stats if table doesn't exist or has no data
        return {
          total: 0,
          byStatus: {},
          totalRevenue: 0
        };
      }

      const stats = {
        total: ordersData?.length || 0,
        byStatus: {},
        totalRevenue: 0
      };

      if (ordersData) {
        ordersData.forEach(order => {
          stats.byStatus[order.order_status] = (stats.byStatus[order.order_status] || 0) + 1;
          stats.totalRevenue += parseFloat(order.total_price) || 0;
        });
      }

      return stats;
    } catch (error) {
      console.error('GET ORDER STATS SERVICE ERROR:', error);
      // Return empty stats instead of throwing error
      return {
        total: 0,
        byStatus: {},
        totalRevenue: 0
      };
    }
  },

  // Merchant & Restaurant Management
  async getAllRestaurants(page = 1, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .range((page - 1) * limit, page * limit - 1)
        .order('name', { ascending: true });

      if (error) throw error;

      return {
        restaurants: data || [],
        page,
        limit
      };
    } catch (error) {
      console.error('GET ALL RESTAURANTS SERVICE ERROR:', error);
      throw new Error('Failed to fetch restaurants');
    }
  },

  async createRestaurant(restaurantData) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurantData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('CREATE RESTAURANT SERVICE ERROR:', error);
      throw new Error('Failed to create restaurant');
    }
  },

  async updateRestaurant(restaurantId, restaurantData) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update(restaurantData)
        .eq('restaurant_id', restaurantId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('UPDATE RESTAURANT SERVICE ERROR:', error);
      throw new Error('Failed to update restaurant');
    }
  },

  async deleteRestaurant(restaurantId) {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('restaurant_id', restaurantId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('DELETE RESTAURANT SERVICE ERROR:', error);
      throw new Error('Failed to delete restaurant');
    }
  },

  async getRestaurantStats(restaurantId) {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('order_status, total_price')
        .eq('restaurant_id', restaurantId);

      if (ordersError) throw ordersError;

      const { data: foodItemsData, error: foodItemsError } = await supabase
        .from('food_items')
        .select('food_id, is_available')
        .eq('restaurant_id', restaurantId);

      if (foodItemsError) throw foodItemsError;

      const stats = {
        totalOrders: ordersData?.length || 0,
        byStatus: {},
        totalRevenue: 0,
        totalFoodItems: foodItemsData?.length || 0,
        availableFoodItems: 0
      };

      if (ordersData) {
        ordersData.forEach(order => {
          stats.byStatus[order.order_status] = (stats.byStatus[order.order_status] || 0) + 1;
          stats.totalRevenue += parseFloat(order.total_price) || 0;
        });
      }

      if (foodItemsData) {
        stats.availableFoodItems = foodItemsData.filter(item => item.is_available).length;
      }

      return stats;
    } catch (error) {
      console.error('GET RESTAURANT STATS SERVICE ERROR:', error);
      throw new Error('Failed to fetch restaurant stats');
    }
  },

  // System Settings & Security
  async getSystemSettings() {
    try {
      // For now, return default settings. In production, store these in a settings table
      return {
        siteName: 'The Fooder',
        maintenanceMode: false,
        allowRegistration: true,
        maxOrderValue: 10000,
        deliveryFee: 2.00
      };
    } catch (error) {
      console.error('GET SYSTEM SETTINGS SERVICE ERROR:', error);
      throw new Error('Failed to fetch system settings');
    }
  },

  async updateSystemSettings(settings) {
    try {
      // For now, just return the settings. In production, store these in a settings table
      return settings;
    } catch (error) {
      console.error('UPDATE SYSTEM SETTINGS SERVICE ERROR:', error);
      throw new Error('Failed to update system settings');
    }
  },

  async getAllUsers(page = 1, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, username, email, role, created_at')
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        users: data || [],
        page,
        limit
      };
    } catch (error) {
      console.error('GET ALL USERS SERVICE ERROR:', error);
      throw new Error('Failed to fetch users');
    }
  },

  async updateUserRole(userId, role) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('UPDATE USER ROLE SERVICE ERROR:', error);
      throw new Error('Failed to update user role');
    }
  },

  async deleteUser(userId) {
    try {
      const { data: targetUser, error: fetchError } = await supabase
        .from('users')
        .select('user_id, role')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!targetUser) {
        const notFoundError = new Error('User not found');
        notFoundError.status = 404;
        throw notFoundError;
      }

      if (targetUser.role === 'admin') {
        const forbiddenError = new Error('Cannot delete an admin account');
        forbiddenError.status = 403;
        throw forbiddenError;
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('DELETE USER SERVICE ERROR:', error);
      throw new Error('Failed to delete user');
    }
  },

  // Create admin with specific grants (Super Admin only)
  async createAdminWithGrants(adminData, grants, superAdminId) {
    return await rolePermissionService.createAdminWithGrants(adminData, grants, superAdminId);
  }
};
