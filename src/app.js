import express from 'express'
import cors from 'cors'
import pixRoutes from './routes/pix.routes.js'
import { webhook } from './webhooks/mercadoPago.webhook.js'
import { getDashboard } from './controllers/dashboard.controller.js'
import { Vote } from './controllers/vote.controller.js'

const app = express()

app.use(cors({
    origin: [
        'http://localhost:5174', // Vite
        'http://localhost:3000',  // se precisar
        "https://pesquisa-real-front.vercel.app",
        "www.pesquisareal.org",
        "https://www.pesquisareal.org"
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}))

app.use(express.json())

app.use('/pix', pixRoutes)
app.use('/vote', Vote)
app.get('/dashboard', getDashboard)
app.post('/webhook/mercadopago', webhook)

export default app
