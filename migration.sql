DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
customer_id SERIAL PRIMARY KEY,
first_name TEXT,
last_name TEXT,
phone_number TEXT,
eye_shape TEXT,
lash_type TEXT,
tweezers TEXT,
brand TEXT
);