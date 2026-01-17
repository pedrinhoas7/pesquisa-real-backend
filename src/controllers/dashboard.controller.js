// dashboard.controller.js
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firestore.js'

export async function getDashboard(req, res) {
  try {
    const [transactionsSnap, candidatesSnap] = await Promise.all([
      getDocs(collection(db, 'transactions')),
      getDocs(collection(db, 'candidates'))
    ])

    let total = 0
    let confirmed = 0
    let pending = 0

    // mapa por candidato
    const votesMap = {}

    transactionsSnap.forEach(docSnap => {
      const t = docSnap.data()
      total++

      if (t.status === 'CONFIRMED') confirmed++
      if (t.status === 'PENDING') pending++

      if (!votesMap[t.candidatoId]) {
        votesMap[t.candidatoId] = {
          votes: 0,
          confirmedVotes: 0
        }
      }

      votesMap[t.candidatoId].votes++

      if (t.status === 'CONFIRMED') {
        votesMap[t.candidatoId].confirmedVotes++
      }
    })

    // monta candidatos com dados reais
    const candidates = []

    candidatesSnap.forEach(docSnap => {
      const c = docSnap.data()
      const votes = votesMap[docSnap.id] || {
        votes: 0,
        confirmedVotes: 0
      }

      candidates.push({
        id: docSnap.id,
        name: c.name,
        role: c.role,
        avatar: c.avatar,
        votes: votes.votes,
        confirmedVotes: votes.confirmedVotes,
        color: c.color
      })
    })

    res.json({
      stats: {
        total,
        confirmed,
        pending
      },
      candidates
    })
  } catch (err) {
    console.error('Erro no dashboard:', err)
    res.status(500).json({ error: 'Erro ao carregar dashboard' })
  }
}
