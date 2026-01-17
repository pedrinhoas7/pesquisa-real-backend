// pix.controller.js
import { criarPix } from '../services/mercadoPago.service.js'
import { db } from '../firebase/firestore.js'
import { v4 as uuid } from 'uuid'
import { collection, doc, updateDoc } from 'firebase/firestore'

export async function gerarPix(req, res) {
  try {
    const { candidatoId, cpfHash, value, nickname, voteId } = req.body


    if (!candidatoId || !cpfHash || !value) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
    }



    const pix = await criarPix({
      valor: value,
      descricao: 'Pesquisa Real - Enquete Pública Simbólica',
      externalId: voteId
    })

    await updateDoc(
      doc(db, 'transactions', voteId),
      {
        status: 'PENDING',
        updatedAt: new Date()
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
