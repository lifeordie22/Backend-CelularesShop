-- Crear tabla de órdenes si no existe
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_id VARCHAR(255),
  mercado_pago_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Crear tabla de productos si no existe
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
);

-- ✅ Base de datos lista para producción
