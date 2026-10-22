const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- SWAGGER CONFIGURATION ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Summer Kulture API',
      version: '1.0.0',
      description: 'API for buying tickets to the Summer Kulture event',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local development server',
      },
    ],
  },
  // This tells Swagger where to look for our API comments
  apis: ['./index.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve the Swagger UI at http://localhost:3001/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// -----------------------------


// Our Fake Database
let eventData = {
  eventName: "SUMMER KULTURE",
  presenter: "GROOVE KULTURE X EXCLUSIVE SOUNDS",
  tagline: "SPLASH. SIP. REPEAT. GROOVE.",
  date: "24 OCT 2026",
  time: "12:00 - 00:00",
  location: "72 ALSATION STREET, GLEN AUSTIN, MIDRAND",
  ticketPrice: 50, // I put a placeholder price, you can change it!
  ticketsAvailable: 200,
  lineup: [
    "034 MAFIA", "LES-D", "FLAYWAY", "YBF", "YONDIE",
    "LOSTBXY", "THAMANI", "CHOPPER", "TKKM", "DETOXIC",
    "SJIJOWW", "JIMMY", "MLOTSHWA", "KEAZY", "MJAKES"
  ]
};

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: Get event information
 *     description: Returns the details of the Summer Kulture event, including available tickets.
 *     responses:
 *       200:
 *         description: Successful response
 */
app.get('/api/event', (req, res) => {
  res.json(eventData);
});

/**
 * @swagger
 * /api/buy-ticket:
 *   post:
 *     summary: Buy a ticket
 *     description: Decreases the ticket count by 1 if tickets are available.
 *     responses:
 *       200:
 *         description: Ticket purchased successfully
 *       400:
 *         description: Sold out
 */
app.post('/api/buy-ticket', (req, res) => {
  if (eventData.ticketsAvailable > 0) {
    eventData.ticketsAvailable -= 1;
    res.json({ 
      success: true, 
      message: "Ticket purchased successfully!", 
      ticketsAvailable: eventData.ticketsAvailable 
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: "Sold out!" 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🍳 Backend Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});