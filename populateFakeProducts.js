import mysql from 'mysql2/promise';

// Configuración de la conexión a MySQL
const dbConfig = {
  host: 'localhost',       // tu host, normalmente localhost
  user: 'root',            // tu usuario
  password: '', // reemplaza con tu contraseña
  database: 'celulares_shop'  // tu base de datos
};

// Arrays con marcas y modelos para generar nombres
const brands = ['Apple', 'Samsung', 'Motorola', 'Xiaomi', 'Huawei', 'Oppo', 'OnePlus'];
const models = ['Pro', 'Max', 'Lite', 'Ultra', 'SE', 'Note', 'Edge'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProduct() {
  const brand = brands[randomInt(0, brands.length - 1)];
  const model = models[randomInt(0, models.length - 1)];
  const version = randomInt(1, 20);
  const price = randomInt(20000, 1200000);
  const name = `${brand} ${model} ${version}`;
  const image = `https://picsum.photos/seed/${encodeURIComponent(name)}/200/200`;

  return { name, price, category: brand, image, quantity: 0 };
}

async function populateProducts(count = 200) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    for (let i = 0; i < count; i++) {
      const product = generateProduct();
      await connection.execute(
        'INSERT INTO products (name, price, category, image, quantity) VALUES (?, ?, ?, ?, ?)',
        [product.name, product.price, product.category, product.image, product.quantity]
      );
    }

    console.log(`${count} productos generados correctamente!`);
    await connection.end();
  } catch (error) {
    console.error('Error poblando productos:', error);
  }
}

populateProducts();
