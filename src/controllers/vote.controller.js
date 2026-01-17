import { db } from '../firebase/firestore.js'
import { v4 as uuid } from 'uuid'
import { collection, doc, setDoc } from 'firebase/firestore'

export async function Vote(req, res) {
  try {
    const { candidatoId, cpfHash, nickname, isPublicVote } = req.body

    if (!candidatoId || !cpfHash || !nickname, !isPublicVote) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
    }

    const voteId = uuid()

    await setDoc(
      doc(collection(db, 'transactions'), voteId),
      {
        voteId,
        candidatoId,
        cpfHash,
        nickname,
        isPublicVote,
        mpPaymentId: null,
        externalReference: voteId,
        status: 'NONE',
        createdAt: new Date()
      }
    )

    return res.json({
      transactionId: voteId
    })

  } catch (err) {
    console.error('Erro ao computar voto:', err)
    return res.status(500).json({ error: 'Erro ao computar voto' })
  }
}
