import { Route, Routes, useParams } from 'react-router-dom'
import Home from './pages/Home'
import { packs } from './sound/packs'

function SoundDemo() {
  const { id } = useParams()
  return <Home pack={packs.find((p) => p.id === id) ?? packs[0]} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sound/:id" element={<SoundDemo />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
