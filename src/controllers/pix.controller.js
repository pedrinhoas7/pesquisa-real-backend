// pix.controller.js
import { criarPix } from '../services/mercadoPago.service.js'
import { db } from '../firebase/firestore.js'
import { v4 as uuid } from 'uuid'
import { collection, doc, setDoc } from 'firebase/firestore'

export async function gerarPix(req, res) {
  try {
    const { candidatoId, cpfHash } = req.body

    if (!candidatoId || !cpfHash) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
    }

    const voteId = uuid()

    const pix = await criarPix({
      valor: 1,
      descricao: 'Pesquisa Real - Enquete Pública Simbólica',
      externalId: voteId
    })

    await setDoc(
      doc(collection(db, 'transactions'), voteId),
      {
        voteId,
        candidatoId,
        cpfHash,
        mpPaymentId: pix.id,
        externalReference: voteId,
        status: 'PENDING',
        createdAt: new Date()
      }
    )

    return res.json({
      ...pix,
      transactionId: voteId
    })

  } catch (err) {
    console.error('Erro ao gerar PIX:', err)
    return res.status(500).json({ error: 'Erro ao gerar PIX' })
  }
}
