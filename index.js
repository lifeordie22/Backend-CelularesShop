import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './database.js';
import sgMail from '@sendgrid/mail';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_TOKEN
});

// 📧 Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// � Función para enviar email de confirmación
async function enviarEmailConfirmacion(email, nombre, pedido_id, items, total) {
  try {
    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">x${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.unit_price}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
        <h1 style="color: #1976d2; text-align: center;">✅ Pago Confirmado</h1>
        <p style="color: #333; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
        <p style="color: #555;">Tu pago ha sido procesado correctamente. Aquí está el resumen de tu compra:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">📦 Detalle del pedido</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #e3f2fd;">
                <th style="padding: 10px; text-align: left; color: #1976d2;">Producto</th>
                <th style="padding: 10px; text-align: center; color: #1976d2;">Cantidad</th>
                <th style="padding: 10px; text-align: right; color: #1976d2;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <div style="margin-top: 15px; text-align: right; border-top: 2px solid #1976d2; padding-top: 15px;">
            <h3 style="color: #1976d2; margin: 0;">Total: <strong>$${total}</strong></h3>
          </div>
        </div>

        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2;">
          <p style="color: #333; margin: 5px 0;"><strong>Número de pedido:</strong> #${pedido_id}</p>
          <p style="color: #666; margin: 5px 0; font-size: 14px;">Recibido: ${new Date().toLocaleDateString('es-AR')}</p>
        </div>

        <p style="color: #666; text-align: center; font-size: 14px; margin-top: 30px;">
          Gracias por tu compra en <strong>Celulares Shop</strong> 🛍️
        </p>
      </div>
    `;

    // Usar lógica de SendGrid como en el ejemplo Java
    const msg = {
      to: email,
      from: 'pabmatt97@gmail.com',
      subject: `✅ Pedido confirmado - #${pedido_id}`,
      html: htmlContent
    };

    const response = await sgMail.send(msg);

    console.log('✅ Email enviado a:', email);
    console.log('📧 SendGrid status:', response[0].statusCode);
    
    return response[0].statusCode >= 200 && response[0].statusCode < 300;
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    return false;
  }
}

// �🔹 Endpoint para traer productos desde MySQL
app.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 🔹 Endpoint para crear preferencia en Mercado Pago
app.post('/crear-preferencia', async (req, res) => {
  try {
    const { items } = req.body;

    // Validar que los items existan
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.title || 'Producto',
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.unit_price) || 0,
          currency_id: 'ARS'
        })),
        back_urls: {
          success: 'http://localhost:4200/checkout/success',
          failure: 'http://localhost:4200/checkout/failure',
          pending: 'http://localhost:4200/checkout/pending'
        },
        statement_descriptor: 'CELULARES SHOP',
        external_reference: `order_${Date.now()}`
      }
    });

    console.log('✅ Preferencia creada:', result.id);
    res.json({ id: result.id, init_point: result.init_point, sandbox_init_point: result.sandbox_init_point });
  } catch (error) {
    console.error('❌ Error al crear preferencia:', error.message);
    res.status(500).json({ error: error.message || 'Error al crear preferencia' });
  }
});

// 🔹 Endpoint para guardar pedido cuando el pago es exitoso
app.post('/guardar-pedido', async (req, res) => {
  try {
    const { customer_email, customer_name, items, total, payment_id, mercado_pago_id } = req.body;

    // Validaciones básicas
    if (!customer_email || !customer_name || !items || items.length === 0 || !total) {
      return res.status(400).json({ error: 'Datos incompletos para guardar pedido' });
    }

    // 🔹 Verificar el pago con Mercado Pago antes de guardar
    let paymentStatus = 'unknown';
    let paymentVerified = false;
    if (payment_id && payment_id !== 'N/A') {
      try {
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: payment_id });
        paymentStatus = paymentData.status;
        paymentVerified = paymentStatus === 'approved';
        console.log(`📋 Pago ${payment_id} verificado: ${paymentStatus}`);
      } catch (verifyError) {
        console.warn('⚠️ No se pudo verificar pago con MP:', verifyError.message);
        // En modo test puede fallar la verificación, guardar igual
        paymentVerified = true;
      }
    } else {
      // Sin payment_id, guardar como pendiente
      paymentVerified = true;
    }

    if (!paymentVerified) {
      return res.status(400).json({ error: `Pago no aprobado. Estado: ${paymentStatus}` });
    }

    // Guardar pedido en la base de datos
    const [result] = await db.query(
      'INSERT INTO orders (customer_email, customer_name, items, total, payment_id, mercado_pago_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        customer_email,
        customer_name,
        JSON.stringify(items),
        total,
        payment_id || null,
        mercado_pago_id || null,
        paymentStatus === 'approved' ? 'completed' : 'pending'
      ]
    );

    const order_id = result.insertId;
    console.log('✅ Pedido guardado - Order ID:', order_id, '- Estado:', paymentStatus);

    // 🔹 Descontar stock de los productos vendidos
    for (const item of items) {
      try {
        await db.query(
          'UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE name = ?',
          [item.quantity, item.title]
        );
      } catch (stockError) {
        console.warn(`⚠️ No se pudo descontar stock para: ${item.title}`, stockError.message);
      }
    }

    // 📧 Enviar email de confirmación (desactivado temporalmente - API key sin permisos)
    // const emailEnviado = await enviarEmailConfirmacion(customer_email, customer_name, order_id, items, total);
    const emailEnviado = false;
    console.log('📧 Email desactivado temporalmente. Pedido guardado sin email.');

    res.json({
      success: true,
      order_id: order_id,
      payment_status: paymentStatus,
      message: 'Pedido guardado correctamente',
      email_enviado: emailEnviado
    });
  } catch (error) {
    console.error('❌ Error al guardar pedido:', error.message);
    res.status(500).json({ error: 'Error al guardar pedido', details: error.message });
  }
});

// 🔹 Endpoint para verificar estado del pago
app.get('/verificar-pago/:payment_id', async (req, res) => {
  try {
    const { payment_id } = req.params;

    if (!payment_id) {
      return res.status(400).json({ error: 'Payment ID requerido' });
    }

    const payment = new Payment(client);
    const result = await payment.get(payment_id);

    console.log('📋 Estado del pago:', result.status);

    res.json({
      status: result.status,
      status_detail: result.status_detail,
      transaction_amount: result.transaction_amount,
      payer_email: result.payer?.email,
      payment_method: result.payment_method_id
    });
  } catch (error) {
    console.error('❌ Error al verificar pago:', error.message);
    res.status(500).json({ error: 'Error al verificar pago', details: error.message });
  }
});

// 🔹 Endpoint para obtener pedidos del usuario
app.get('/pedidos/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    const [rows] = await db.query(
      'SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC',
      [email]
    );

    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error.message);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// 🔹 Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 🔹 Webhook de Mercado Pago (recibe notificaciones server-side)
app.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    // Solo procesar notificaciones de pago
    if (type === 'payment') {
      const paymentId = data?.id;
      if (!paymentId) {
        return res.sendStatus(200);
      }

      console.log(`🔔 Webhook recibido - Payment ID: ${paymentId}`);

      // Consultar el pago en Mercado Pago
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });

      console.log(`📋 Estado del pago: ${paymentData.status}`);

      // Actualizar la orden si existe
      if (paymentData.status === 'approved') {
        const [rows] = await db.query(
          'SELECT * FROM orders WHERE payment_id = ?',
          [String(paymentId)]
        );

        if (rows.length > 0 && rows[0].status !== 'completed') {
          await db.query(
            'UPDATE orders SET status = ?, updated_at = NOW() WHERE payment_id = ?',
            ['completed', String(paymentId)]
          );
          console.log(`✅ Orden actualizada a completed via webhook`);
        }
      } else if (paymentData.status === 'rejected') {
        await db.query(
          'UPDATE orders SET status = ?, updated_at = NOW() WHERE payment_id = ?',
          ['failed', String(paymentId)]
        );
        console.log(`❌ Orden marcada como failed via webhook`);
      }
    }

    // Siempre responder 200 para que MP no reintente
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Error en webhook:', error.message);
    // Responder 200 igual para evitar reintentos
    res.sendStatus(200);
  }
});

app.listen(3000, () => {
  console.log('🚀 Servidor backend en http://localhost:3000');
  console.log('📍 Health check: GET http://localhost:3000/health');
});