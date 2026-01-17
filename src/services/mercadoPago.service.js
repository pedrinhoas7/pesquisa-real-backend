import client from '../config/mercadoPago.js'
import { Payment } from 'mercadopago'

export async function criarPix({ valor, descricao, externalId }) {
  const payment = new Payment(client)

  const body = {
    transaction_amount: Number(valor),
    description: descricao,
    payment_method_id: 'pix',
    external_reference: externalId,
    payer: {
      email: 'pedrinhoas7@gmail.com'
    }
  }

  const response = await payment.create({ body })

  return {
    id: response.id,
    qrCode: response.point_of_interaction.transaction_data.qr_code,
    qrCodeBase64:
      response.point_of_interaction.transaction_data.qr_code_base64
  }
}
