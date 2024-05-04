// This is simple sample how to serve static website and save form data to file with NodeJS
// Usage:
// 1. Install dependencies: npm i
// 2. Run server: node server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const sgMail = require('@sendgrid/mail');

require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(data) {
  return new Promise((resolve, reject) => {
    const msg = {
      to: data.clientEmail,
      from: {
        email: 'kosvik264@gmail.com',
        name: 'Viktor Kosaniak',
      },
      subject: 'Morbride Order',
      text: 'Successful Order',
      html: ` <p>Dear ${data.clientName},</p>
      <p>Thank you for choosing Morbride! We're excited to confirm your recent order. Here are the details:</p>
      <p><strong>Order Number:</strong> ${data.numberOrder}<br>
      <strong>Date:</strong>${data.date}<br></p>
      <p><strong>Items Ordered:</strong><br>
      ${Object.entries(data.cart)
        .map((item, index) => {
          let [cartItemKey, quantity] = item;
          let formattedName = 'Unknown';
          const cartItemObject = JSON.parse(cartItemKey);
          const filename = cartItemObject.image;
          if (filename) {
            const nameWithoutExtension = filename.slice(0, -4);
            formattedName = nameWithoutExtension.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          }
          return `${index + 1}. ID: ${formattedName} - Quantity: ${quantity}`;
        })
        .join('<br>')}</p>
      <p>Total: ${data.total}</p>
      <p>If you have any questions or concerns regarding your order, please feel free to contact us. We'll be happy to assist you.</p>
      <p>Thank you once again for your purchase. We appreciate your business and look forward to serving you again soon!</p>
      <p>Best regards,<br>
      Viktor Kosaniak</p>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './')));

app.post('/order', (req, res) => {
  sendEmail(req.body)
    .then(() => {
      res.status(200).send('Order sent successfully');
    })
    .catch(error => {
      res.status(500).send('Failed to send email');
    });
});

console.log('Server is running on', process.env.PORT || 4000, process.env.IP || '0.0.0.0');

app.listen(process.env.PORT || 4000, process.env.IP || '0.0.0.0');
