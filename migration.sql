DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;

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

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    date TEXT,
    lash_style TEXT,
    length TEXT,
    thickness TEXT,
    curl TEXT,
    glue TEXT,
    primer BOOLEAN,
    bonder BOOLEAN,
    cleanser BOOLEAN,
    customer_id INTEGER NOT NULL,
    CONSTRAINT fk_customer
    FOREIGN KEY (customer_id)
    REFERENCES customers (customer_id)
    ON DELETE CASCADE
);

