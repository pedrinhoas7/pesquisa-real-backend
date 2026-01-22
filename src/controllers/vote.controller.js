import { db } from '../firebase/firestore.js'
import {
  collection,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'

export async function Vote(req, res) {
  try {
    const { candidatoId, cpfHash, nickname, isPublicVote } = req.body

    if (!candidatoId || !cpfHash || !nickname || isPublicVote === undefined) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' })
    }

    const voteRef = doc(db, 'transactions', cpfHash)

    const existingVote = await getDoc(voteRef)

    if (existingVote.exists()) {
      return res.status(409).json({
        error: 'CPF já utilizou seu voto'
      })
    }

    await setDoc(voteRef, {
      voteId: cpfHash,
      candidatoId,
      cpfHash,
      nickname,
      isPublicVote,
      mpPaymentId: null,
      externalReference: cpfHash,
      status: 'NONE',
      createdAt: new Date()
    })

    return res.json({ transactionId: cpfHash })

  } catch (err) {
    console.error('Erro ao computar voto:', err)
    return res.status(500).json({ error: 'Erro ao computar voto' })
  }
}
