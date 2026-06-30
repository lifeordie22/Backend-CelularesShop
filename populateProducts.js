import axios from 'axios';
import mysql from 'mysql2/promise';

// Configuración de la conexión a MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',            // tu usuario
  password: '', // reemplaza con tu contraseña
  database: 'celulares_shop' // tu base de datos
};

async function populateProducts() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Traemos productos de DummyJSON (puede devolver hasta 100 productos)
    const response = await axios.get('https://dummyjson.com/products?limit=100');
    const products = response.data.products;

    for (const product of products) {
      // Solo usamos categoría "smartphones"
      if (product.category === 'smartphones') {
        const { title, price, images } = product;
        const image = images[0] || 'https://via.placeholder.com/150';

        // Insertamos en la tabla products
        await connection.execute(
          'INSERT INTO products (name, price, category, image, quantity) VALUES (?, ?, ?, ?, ?)',
          [title, price, 'Smartphone', image, 0]
        );
      }
    }

    console.log('Productos agregados correctamente!');
    await connection.end();
  } catch (error) {
    console.error('Error poblando productos:', error);
  }
}

populateProducts();
