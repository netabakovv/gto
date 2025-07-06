-- Таблица users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    birth_date DATE NOT NULL,
    gender VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица certificates
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    certificate_number VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_level VARCHAR(50) NOT NULL,
    age_group VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UPCOMING',
    registration_start TIMESTAMP,
    registration_end TIMESTAMP,
    max_participants INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Промежуточная таблица event_judges (многие ко многим)
CREATE TABLE event_judges (
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id)
);

-- Промежуточная таблица event_normatives (многие ко многим)
CREATE TABLE event_normatives (
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    normative_id BIGINT NOT NULL REFERENCES normatives(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, normative_id)
);

-- Таблица normatives
CREATE TABLE normatives (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    age_group VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    bronze_standard NUMERIC(10,2),
    silver_standard NUMERIC(10,2),
    gold_standard NUMERIC(10,2),
    measurement_type VARCHAR(50) NOT NULL
);

-- Таблица registrations
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица results
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    normative_id BIGINT NOT NULL REFERENCES normatives(id) ON DELETE CASCADE,
    value NUMERIC(10,2) NOT NULL,
    achieved_level VARCHAR(50),
    passed BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);