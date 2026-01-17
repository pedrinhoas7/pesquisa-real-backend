import { Payment } from 'mercadopago'
import client from '../config/mercadoPago.js'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/firestore.js'

export async function webhook(req, res) {
  try {
    const paymentId =
      req.body?.data?.id || req.query['data.id']

    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId não encontrado' })
    }

    const paymentClient = new Payment(client)

    const payment = await paymentClient.get({ id: paymentId })

    const status = payment.status
    const externalReference = payment.external_reference

    if (!externalReference) {
      return res.status(200).json({ ok: true })
    }

    // busca a transação pelo voteId
    const q = query(
      collection(db, 'transactions'),
      where('externalReference', '==', externalReference)
    )

    const snapshot = await getDocs(q)

    snapshot.forEach(async d => {
      await updateDoc(doc(db, 'transactions', d.id), {
        status: status === 'approved' ? 'CONFIRMED' : 'PENDING',
        mpStatus: status,
        updatedAt: new Date()
      })
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Erro webhook MP:', err)
    return res.status(500).json({ error: 'Webhook error' })
  }
}
