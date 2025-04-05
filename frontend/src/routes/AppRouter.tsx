import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Dictionary from '../pages/Dictionary'

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dictionary" element={<Dictionary />} />
  </Routes>
)

export default AppRouter