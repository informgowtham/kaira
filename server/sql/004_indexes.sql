CREATE INDEX IF NOT EXISTS idx_deliveries_polling ON deliveries (delivery_state, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_analytics_board_id ON analytics_events (board_id);
