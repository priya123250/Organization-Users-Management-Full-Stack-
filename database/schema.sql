-- Organizations Table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact VARCHAR(50),
    phone VARCHAR(50),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'inactive')),
    max_coordinators INTEGER DEFAULT 5,
    timezone VARCHAR(100),
    language VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Co-ordinator')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_org_status ON organizations(status);
CREATE INDEX idx_user_org_id ON users(organization_id);
CREATE INDEX idx_user_email ON users(email);

-- Sample Data (Optional)
INSERT INTO organizations (name, slug, email, contact, status) VALUES
    ('GITAM Institute of Technology', 'gitam', 'gitam@gitam.in', '91 - 9676456543', 'active'),
    ('Massachusetts Institute of Technology', 'mit', 'contact@mit.edu', '91 - 9876543210', 'blocked'),
    ('Stanford University', 'stanford', 'info@stanford.edu', '91 - 8765432109', 'inactive');

INSERT INTO users (organization_id, name, email, role) VALUES
    (1, 'Dave Richards', 'dave@gitam.in', 'Admin'),
    (1, 'Abhishek Hari', 'abhishek@gitam.in', 'Co-ordinator'),
    (1, 'Nishta Gupta', 'nishta@gitam.in', 'Admin');
