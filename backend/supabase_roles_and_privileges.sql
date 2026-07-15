-- Database roles and privileges for The Fooder

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_customer') THEN
    CREATE ROLE app_customer NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_admin') THEN
    CREATE ROLE app_admin NOLOGIN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_super_admin') THEN
    CREATE ROLE app_super_admin NOLOGIN;
  END IF;
END $$;

-- Role inheritance mirrors the application hierarchy.
GRANT app_customer TO app_admin;
GRANT app_admin TO app_super_admin;

-- Lock down schema access first, then grant only what the app needs.
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO app_customer, app_admin, app_super_admin;

-- Public browsing data.
GRANT SELECT ON restaurants, food_items, tags, food_tags, promotions TO anon, authenticated, service_role;
GRANT SELECT ON restaurants, food_items, tags, food_tags, promotions TO app_customer, app_admin, app_super_admin;

-- Customer activity data.
GRANT SELECT, INSERT, UPDATE, DELETE ON users, user_preferences, cart_items, swipe_logs, orders, order_items, user_coupons TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON users, user_preferences, cart_items, swipe_logs, orders, order_items, user_coupons TO app_customer, app_admin, app_super_admin;

-- Admin and operational data.
GRANT SELECT, INSERT, UPDATE, DELETE ON restaurant_users TO service_role;
GRANT ALL PRIVILEGES ON users, user_preferences, restaurant_users, restaurants, food_items, tags, food_tags, swipe_logs, cart_items, promotions, user_coupons, orders, order_items, page_analytics TO service_role;
GRANT ALL PRIVILEGES ON users, user_preferences, restaurant_users, restaurants, food_items, tags, food_tags, swipe_logs, cart_items, promotions, user_coupons, orders, order_items, page_analytics TO app_admin;
GRANT ALL PRIVILEGES ON users, user_preferences, restaurant_users, restaurants, food_items, tags, food_tags, swipe_logs, cart_items, promotions, user_coupons, orders, order_items, page_analytics TO app_super_admin;

-- Ensure future tables and sequences inherit the same privilege model.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_customer, app_admin, app_super_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_customer, app_admin, app_super_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_customer, app_admin, app_super_admin;

-- Explicit sequence access for the existing identity columns.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_customer, app_admin, app_super_admin;