-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  features TEXT DEFAULT '[]',
  category TEXT NOT NULL,
  specifications TEXT DEFAULT '{}',
  price REAL,
  in_stock INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  technologies TEXT DEFAULT '[]',
  category TEXT NOT NULL,
  results TEXT,
  featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Robo Advisor tables
CREATE TABLE IF NOT EXISTS user_investment_profiles (
  user_id TEXT PRIMARY KEY,
  risk_tolerance TEXT DEFAULT 'moderate',
  financial_goals TEXT DEFAULT '[]',
  target_allocation TEXT DEFAULT '{}',
  rebalancing_threshold REAL DEFAULT 0.05,
  rebalancing_frequency TEXT DEFAULT 'quarterly',
  tax_loss_harvesting_opt_in INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares REAL NOT NULL,
  avg_price REAL NOT NULL,
  current_price REAL NOT NULL,
  sector TEXT,
  UNIQUE(user_id, symbol)
);

CREATE TABLE IF NOT EXISTS rebalancing_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  asset_symbol TEXT NOT NULL,
  asset_name TEXT,
  quantity REAL NOT NULL,
  price REAL NOT NULL,
  transaction_cost REAL DEFAULT 5,
  status TEXT DEFAULT 'completed',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tax_loss_harvesting_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  sold_symbol TEXT NOT NULL,
  shares_sold REAL NOT NULL,
  realized_loss_amount REAL NOT NULL,
  replacement_symbol TEXT,
  replacement_name TEXT,
  status TEXT DEFAULT 'completed',
  created_at TEXT DEFAULT (datetime('now'))
);
