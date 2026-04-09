import 'dotenv/config';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'celulares_shop'
};

// 200+ celulares reales con imagenes de GSMArena y precios en ARS (2026)
const products = [
  // ===== APPLE - iPhone (25 modelos) =====
  { name: 'iPhone 16 Pro Max 256GB', price: 2899999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg' },
  { name: 'iPhone 16 Pro Max 512GB', price: 3299999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg' },
  { name: 'iPhone 16 Pro Max 1TB', price: 3799999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg' },
  { name: 'iPhone 16 Pro 128GB', price: 2499999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg' },
  { name: 'iPhone 16 Pro 256GB', price: 2699999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg' },
  { name: 'iPhone 16 Pro 512GB', price: 2999999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg' },
  { name: 'iPhone 16 128GB', price: 1799999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg' },
  { name: 'iPhone 16 256GB', price: 1999999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg' },
  { name: 'iPhone 16 Plus 128GB', price: 1999999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg' },
  { name: 'iPhone 16 Plus 256GB', price: 2199999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg' },
  { name: 'iPhone 15 Pro Max 256GB', price: 2599999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg' },
  { name: 'iPhone 15 Pro Max 512GB', price: 2899999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg' },
  { name: 'iPhone 15 Pro 128GB', price: 2199999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg' },
  { name: 'iPhone 15 Pro 256GB', price: 2399999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg' },
  { name: 'iPhone 15 128GB', price: 1599999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg' },
  { name: 'iPhone 15 256GB', price: 1799999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg' },
  { name: 'iPhone 15 Plus 128GB', price: 1799999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg' },
  { name: 'iPhone 15 Plus 256GB', price: 1999999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg' },
  { name: 'iPhone 14 128GB', price: 1199999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg' },
  { name: 'iPhone 14 256GB', price: 1399999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg' },
  { name: 'iPhone 14 Plus 128GB', price: 1399999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-plus.jpg' },
  { name: 'iPhone 13 128GB', price: 949999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg' },
  { name: 'iPhone 13 Mini 128GB', price: 849999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-mini.jpg' },
  { name: 'iPhone SE 2022 64GB', price: 799999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg' },
  { name: 'iPhone SE 2022 128GB', price: 899999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg' },
  { name: 'iPhone 12 64GB', price: 749999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg' },
  { name: 'iPhone 12 128GB', price: 849999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg' },
  { name: 'iPhone 11 64GB', price: 599999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11.jpg' },
  { name: 'iPhone 11 128GB', price: 699999, category: 'Apple', image: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11.jpg' },

  // ===== SAMSUNG (40 modelos) =====
  { name: 'Samsung Galaxy S24 Ultra 256GB', price: 2699999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg' },
  { name: 'Samsung Galaxy S24 Ultra 512GB', price: 2999999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg' },
  { name: 'Samsung Galaxy S24 Ultra 1TB', price: 3399999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g.jpg' },
  { name: 'Samsung Galaxy S24+ 256GB', price: 1899999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus.jpg' },
  { name: 'Samsung Galaxy S24+ 512GB', price: 2099999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus.jpg' },
  { name: 'Samsung Galaxy S24 128GB', price: 1499999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg' },
  { name: 'Samsung Galaxy S24 256GB', price: 1649999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg' },
  { name: 'Samsung Galaxy S23 Ultra 256GB', price: 2299999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg' },
  { name: 'Samsung Galaxy S23+ 256GB', price: 1599999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus.jpg' },
  { name: 'Samsung Galaxy S23 128GB', price: 1299999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23.jpg' },
  { name: 'Samsung Galaxy S23 FE 128GB', price: 999999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-fe.jpg' },
  { name: 'Samsung Galaxy S23 FE 256GB', price: 1099999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-fe.jpg' },
  { name: 'Samsung Galaxy Z Fold5 256GB', price: 3199999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5.jpg' },
  { name: 'Samsung Galaxy Z Fold5 512GB', price: 3499999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5.jpg' },
  { name: 'Samsung Galaxy Z Flip5 256GB', price: 1999999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5.jpg' },
  { name: 'Samsung Galaxy Z Flip5 512GB', price: 2199999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5.jpg' },
  { name: 'Samsung Galaxy A74 128GB', price: 749999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a54-5g.jpg' },
  { name: 'Samsung Galaxy A54 128GB', price: 649999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a54-5g.jpg' },
  { name: 'Samsung Galaxy A54 256GB', price: 749999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a54-5g.jpg' },
  { name: 'Samsung Galaxy A34 128GB', price: 499999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a34-5g.jpg' },
  { name: 'Samsung Galaxy A25 128GB', price: 379999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a25-5g.jpg' },
  { name: 'Samsung Galaxy A15 128GB', price: 279999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a15.jpg' },
  { name: 'Samsung Galaxy A15 5G 128GB', price: 319999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a15-5g.jpg' },
  { name: 'Samsung Galaxy A05s 128GB', price: 199999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a05s.jpg' },
  { name: 'Samsung Galaxy A05 64GB', price: 159999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a05.jpg' },
  { name: 'Samsung Galaxy M54 128GB', price: 599999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m54.jpg' },
  { name: 'Samsung Galaxy M34 128GB', price: 449999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m34.jpg' },
  { name: 'Samsung Galaxy M14 64GB', price: 249999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m14-5g.jpg' },
  { name: 'Samsung Galaxy S22 Ultra 128GB', price: 1799999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-ultra-5g.jpg' },
  { name: 'Samsung Galaxy S22 128GB', price: 999999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-5g.jpg' },
  { name: 'Samsung Galaxy S21 FE 128GB', price: 799999, category: 'Samsung', image: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s21-fe-5g.jpg' },

  // ===== MOTOROLA (25 modelos) =====
  { name: 'Motorola Edge 50 Ultra 512GB', price: 1599999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-ultra.jpg' },
  { name: 'Motorola Edge 50 Pro 256GB', price: 1199999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-pro.jpg' },
  { name: 'Motorola Edge 50 Fusion 256GB', price: 799999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-50-fusion.jpg' },
  { name: 'Motorola Edge 40 Pro 256GB', price: 1299999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40-pro.jpg' },
  { name: 'Motorola Edge 40 256GB', price: 899999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40.jpg' },
  { name: 'Motorola Edge 40 Neo 256GB', price: 699999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40-neo.jpg' },
  { name: 'Motorola Edge 30 Ultra 256GB', price: 1099999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-30-ultra.jpg' },
  { name: 'Motorola Edge 30 Fusion 128GB', price: 749999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-30-fusion.jpg' },
  { name: 'Motorola Razr 40 Ultra 256GB', price: 1799999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-40-ultra.jpg' },
  { name: 'Motorola Razr 40 128GB', price: 1299999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-razr-40.jpg' },
  { name: 'Motorola Moto G84 256GB', price: 549999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g84.jpg' },
  { name: 'Motorola Moto G73 128GB', price: 449999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g73.jpg' },
  { name: 'Motorola Moto G54 128GB', price: 379999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g54-power.jpg' },
  { name: 'Motorola Moto G54 256GB', price: 429999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g54-power.jpg' },
  { name: 'Motorola Moto G34 128GB', price: 279999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g34.jpg' },
  { name: 'Motorola Moto G24 128GB', price: 219999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g24.jpg' },
  { name: 'Motorola Moto G24 Power 128GB', price: 239999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g24-power.jpg' },
  { name: 'Motorola Moto G14 128GB', price: 179999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g14.jpg' },
  { name: 'Motorola Moto G04 64GB', price: 149999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g04.jpg' },
  { name: 'Motorola Moto E22 64GB', price: 139999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e22.jpg' },
  { name: 'Motorola Moto E22i 32GB', price: 109999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e22i.jpg' },
  { name: 'Motorola Moto E13 64GB', price: 119999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e13.jpg' },
  { name: 'Motorola ThinkPhone 256GB', price: 1099999, category: 'Motorola', image: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-thinkphone.jpg' },

  // ===== XIAOMI (35 modelos) =====
  { name: 'Xiaomi 14 Ultra 512GB', price: 2199999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-ultra.jpg' },
  { name: 'Xiaomi 14 Pro 256GB', price: 1799999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14-pro.jpg' },
  { name: 'Xiaomi 14 256GB', price: 1499999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-14.jpg' },
  { name: 'Xiaomi 13T Pro 256GB', price: 1099999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13t-pro.jpg' },
  { name: 'Xiaomi 13T 256GB', price: 899999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13t.jpg' },
  { name: 'Xiaomi 13 256GB', price: 1199999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13.jpg' },
  { name: 'Xiaomi 13 Lite 128GB', price: 649999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-lite.jpg' },
  { name: 'Xiaomi 12T Pro 256GB', price: 999999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-12t-pro.jpg' },
  { name: 'Xiaomi 12T 128GB', price: 749999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-12t.jpg' },
  { name: 'Xiaomi Redmi Note 13 Pro+ 256GB', price: 749999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-plus-5g.jpg' },
  { name: 'Xiaomi Redmi Note 13 Pro 256GB', price: 599999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-5g.jpg' },
  { name: 'Xiaomi Redmi Note 13 128GB', price: 399999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-4g.jpg' },
  { name: 'Xiaomi Redmi Note 13 256GB', price: 449999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-4g.jpg' },
  { name: 'Xiaomi Redmi Note 12 Pro+ 256GB', price: 649999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-pro-plus-5g.jpg' },
  { name: 'Xiaomi Redmi Note 12 Pro 128GB', price: 499999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-pro-5g.jpg' },
  { name: 'Xiaomi Redmi Note 12 128GB', price: 349999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-4g.jpg' },
  { name: 'Xiaomi Redmi Note 12S 256GB', price: 449999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12s.jpg' },
  { name: 'Xiaomi Redmi 13C 128GB', price: 219999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c.jpg' },
  { name: 'Xiaomi Redmi 13C 256GB', price: 259999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c.jpg' },
  { name: 'Xiaomi Redmi 12 128GB', price: 249999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-12-4g.jpg' },
  { name: 'Xiaomi Redmi 12 256GB', price: 299999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-12-4g.jpg' },
  { name: 'Xiaomi Redmi A2 64GB', price: 119999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a2.jpg' },
  { name: 'Xiaomi Redmi A2+ 64GB', price: 139999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a2-plus.jpg' },
  { name: 'Xiaomi POCO X6 Pro 256GB', price: 699999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-pro-5g.jpg' },
  { name: 'Xiaomi POCO X6 256GB', price: 549999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x6-5g.jpg' },
  { name: 'Xiaomi POCO X5 Pro 256GB', price: 549999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-x5-pro-5g.jpg' },
  { name: 'Xiaomi POCO F5 256GB', price: 599999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f5.jpg' },
  { name: 'Xiaomi POCO F5 Pro 256GB', price: 799999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-f5-pro.jpg' },
  { name: 'Xiaomi POCO M6 Pro 128GB', price: 349999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m6-pro-4g.jpg' },
  { name: 'Xiaomi POCO M5 128GB', price: 249999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-m5.jpg' },
  { name: 'Xiaomi POCO C65 128GB', price: 179999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-poco-c65.jpg' },
  { name: 'Xiaomi Mi 11 Lite 128GB', price: 499999, category: 'Xiaomi', image: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-11-lite-5g-ne.jpg' },

  // ===== GOOGLE (10 modelos) =====
  { name: 'Google Pixel 8 Pro 128GB', price: 1899999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro-new.jpg' },
  { name: 'Google Pixel 8 Pro 256GB', price: 2099999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro-new.jpg' },
  { name: 'Google Pixel 8 128GB', price: 1399999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg' },
  { name: 'Google Pixel 8 256GB', price: 1549999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg' },
  { name: 'Google Pixel 8a 128GB', price: 999999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg' },
  { name: 'Google Pixel 7 Pro 128GB', price: 1299999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7-pro-new.jpg' },
  { name: 'Google Pixel 7 128GB', price: 999999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7.jpg' },
  { name: 'Google Pixel 7a 128GB', price: 849999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7a.jpg' },
  { name: 'Google Pixel 6a 128GB', price: 649999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6a.jpg' },
  { name: 'Google Pixel 6 128GB', price: 749999, category: 'Google', image: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6.jpg' },

  // ===== ONEPLUS (12 modelos) =====
  { name: 'OnePlus 12 256GB', price: 1699999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg' },
  { name: 'OnePlus 12 512GB', price: 1899999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg' },
  { name: 'OnePlus 12R 128GB', price: 999999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg' },
  { name: 'OnePlus 12R 256GB', price: 1099999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg' },
  { name: 'OnePlus 11 256GB', price: 1299999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg' },
  { name: 'OnePlus 11R 128GB', price: 899999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-11r.jpg' },
  { name: 'OnePlus Nord 3 128GB', price: 699999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord3-5g.jpg' },
  { name: 'OnePlus Nord CE 3 128GB', price: 549999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce-3.jpg' },
  { name: 'OnePlus Nord CE 3 Lite 128GB', price: 449999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce3-lite.jpg' },
  { name: 'OnePlus Nord N30 128GB', price: 399999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-n30-5g.jpg' },
  { name: 'OnePlus 10 Pro 128GB', price: 1099999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-10-pro.jpg' },
  { name: 'OnePlus 10T 128GB', price: 849999, category: 'OnePlus', image: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-10t.jpg' },

  // ===== HUAWEI (12 modelos) =====
  { name: 'Huawei Mate 60 Pro 256GB', price: 2499999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-60-pro.jpg' },
  { name: 'Huawei Mate 60 256GB', price: 1999999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-60.jpg' },
  { name: 'Huawei P60 Pro 256GB', price: 1599999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-p60-pro.jpg' },
  { name: 'Huawei P60 256GB', price: 1299999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-p60.jpg' },
  { name: 'Huawei P50 Pro 256GB', price: 1099999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-p50-pro.jpg' },
  { name: 'Huawei Nova 12 256GB', price: 799999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-12i.jpg' },
  { name: 'Huawei Nova 11 256GB', price: 699999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-11.jpg' },
  { name: 'Huawei Nova 11i 128GB', price: 449999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-11i.jpg' },
  { name: 'Huawei Nova Y90 128GB', price: 349999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-y90.jpg' },
  { name: 'Huawei Nova Y70 128GB', price: 279999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-y70.jpg' },
  { name: 'Huawei Nova Y61 64GB', price: 219999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-nova-y61.jpg' },
  { name: 'Huawei Mate 50 Pro 256GB', price: 1399999, category: 'Huawei', image: 'https://fdn2.gsmarena.com/vv/bigpic/huawei-mate-50-pro.jpg' },

  // ===== REALME (12 modelos) =====
  { name: 'Realme GT 5 Pro 256GB', price: 1199999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt5-pro.jpg' },
  { name: 'Realme GT Neo 5 256GB', price: 999999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt-neo5.jpg' },
  { name: 'Realme GT 3 256GB', price: 899999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-gt3.jpg' },
  { name: 'Realme 11 Pro+ 256GB', price: 699999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-11-pro-plus.jpg' },
  { name: 'Realme 11 Pro 128GB', price: 549999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-11-pro.jpg' },
  { name: 'Realme 11 128GB', price: 399999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-11-4g.jpg' },
  { name: 'Realme 10 Pro+ 128GB', price: 499999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-10-pro-plus.jpg' },
  { name: 'Realme 10 128GB', price: 349999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-10-4g.jpg' },
  { name: 'Realme C67 128GB', price: 249999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-c67-4g.jpg' },
  { name: 'Realme C55 128GB', price: 229999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-c55.jpg' },
  { name: 'Realme C53 128GB', price: 199999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-c53.jpg' },
  { name: 'Realme C33 64GB', price: 159999, category: 'Realme', image: 'https://fdn2.gsmarena.com/vv/bigpic/realme-c33.jpg' },

  // ===== TECNO (10 modelos) =====
  { name: 'Tecno Phantom V Fold 256GB', price: 1899999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-phantom-v-fold.jpg' },
  { name: 'Tecno Phantom V Flip 256GB', price: 1199999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-phantom-v-flip.jpg' },
  { name: 'Tecno Phantom X2 Pro 256GB', price: 999999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-phantom-x2-pro.jpg' },
  { name: 'Tecno Camon 20 Pro 256GB', price: 449999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-camon-20-pro.jpg' },
  { name: 'Tecno Camon 20 128GB', price: 349999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-camon-20.jpg' },
  { name: 'Tecno Pova 5 Pro 256GB', price: 399999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-pova-5-pro.jpg' },
  { name: 'Tecno Pova 5 128GB', price: 299999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-pova-5.jpg' },
  { name: 'Tecno Spark 10 Pro 128GB', price: 249999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-spark-10-pro.jpg' },
  { name: 'Tecno Spark 10 64GB', price: 179999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-spark-10.jpg' },
  { name: 'Tecno Pop 7 Pro 64GB', price: 129999, category: 'Tecno', image: 'https://fdn2.gsmarena.com/vv/bigpic/tecno-pop-7-pro.jpg' },

  // ===== HONOR (10 modelos) =====
  { name: 'Honor Magic 6 Pro 512GB', price: 1899999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-magic6-pro.jpg' },
  { name: 'Honor Magic 5 Pro 256GB', price: 1499999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-magic5-pro.jpg' },
  { name: 'Honor 90 256GB', price: 799999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-90.jpg' },
  { name: 'Honor 90 Lite 128GB', price: 449999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-90-lite.jpg' },
  { name: 'Honor X9b 256GB', price: 549999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-x9b.jpg' },
  { name: 'Honor X8b 128GB', price: 399999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-x8b.jpg' },
  { name: 'Honor X7b 128GB', price: 299999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-x7b.jpg' },
  { name: 'Honor X6a 128GB', price: 199999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-x6a.jpg' },
  { name: 'Honor 70 128GB', price: 649999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-70.jpg' },
  { name: 'Honor X9a 128GB', price: 449999, category: 'Honor', image: 'https://fdn2.gsmarena.com/vv/bigpic/honor-x9a.jpg' },

  // ===== SONY (8 modelos) =====
  { name: 'Sony Xperia 1 V 256GB', price: 2299999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-v.jpg' },
  { name: 'Sony Xperia 5 V 128GB', price: 1699999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-v.jpg' },
  { name: 'Sony Xperia 10 V 128GB', price: 799999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-v.jpg' },
  { name: 'Sony Xperia 1 IV 256GB', price: 1899999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-iv.jpg' },
  { name: 'Sony Xperia 5 IV 128GB', price: 1399999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-iv.jpg' },
  { name: 'Sony Xperia 10 IV 128GB', price: 649999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-iv.jpg' },
  { name: 'Sony Xperia Pro-I 512GB', price: 2799999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-pro-i.jpg' },
  { name: 'Sony Xperia 1 III 256GB', price: 1499999, category: 'Sony', image: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-iii.jpg' },

  // ===== OPPO (10 modelos) =====
  { name: 'Oppo Find X7 Ultra 256GB', price: 2199999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x7-ultra.jpg' },
  { name: 'Oppo Find X6 Pro 256GB', price: 1799999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x6-pro.jpg' },
  { name: 'Oppo Reno 11 Pro 256GB', price: 999999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-pro.jpg' },
  { name: 'Oppo Reno 11 256GB', price: 749999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno11-5g.jpg' },
  { name: 'Oppo Reno 10 Pro+ 256GB', price: 899999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno10-pro-plus.jpg' },
  { name: 'Oppo Reno 10 128GB', price: 599999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-reno10-5g.jpg' },
  { name: 'Oppo A98 256GB', price: 499999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a98-5g.jpg' },
  { name: 'Oppo A78 128GB', price: 379999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a78-5g.jpg' },
  { name: 'Oppo A58 128GB', price: 279999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a58-4g.jpg' },
  { name: 'Oppo A18 128GB', price: 189999, category: 'Oppo', image: 'https://fdn2.gsmarena.com/vv/bigpic/oppo-a18.jpg' },

  // ===== VIVO (8 modelos) =====
  { name: 'Vivo X100 Pro 256GB', price: 1699999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg' },
  { name: 'Vivo X100 256GB', price: 1299999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x100.jpg' },
  { name: 'Vivo X90 Pro 256GB', price: 1399999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-x90-pro.jpg' },
  { name: 'Vivo V29 128GB', price: 699999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v29-5g.jpg' },
  { name: 'Vivo V27 128GB', price: 549999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-v27.jpg' },
  { name: 'Vivo Y36 128GB', price: 299999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y36-4g.jpg' },
  { name: 'Vivo Y27 128GB', price: 249999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y27-4g.jpg' },
  { name: 'Vivo Y17s 128GB', price: 199999, category: 'Vivo', image: 'https://fdn2.gsmarena.com/vv/bigpic/vivo-y17s.jpg' },
];

async function populateProducts() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Limpiar tabla de productos existentes
    await connection.execute('DELETE FROM products');
    console.log('🗑️  Tabla products limpiada');

    let count = 0;
    for (const p of products) {
      await connection.execute(
        'INSERT INTO products (name, price, category, image, quantity) VALUES (?, ?, ?, ?, ?)',
        [p.name, p.price, p.category, p.image, 50]
      );
      count++;
    }

    console.log(`✅ ${count} celulares reales insertados correctamente!`);
    console.log('');
    console.log('📱 Marcas incluidas:');

    const brands = [...new Set(products.map(p => p.category))];
    for (const brand of brands) {
      const brandProducts = products.filter(p => p.category === brand);
      console.log(`   ${brand}: ${brandProducts.length} modelos`);
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
  }
}

populateProducts();
