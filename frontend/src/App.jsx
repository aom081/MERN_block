import './App.css'
import { UserContextProvider } from './context/UserContext'
import { Route, Routes} from 'react-router-dom'
import Layout from './components/Layout'
import CreatePage from './pages/CreatePage'
import EditPage from './pages/EditPage'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import PostPage from './pages/PostPage'
import RegisterPage from './pages/RegisterPage'


function App() {


  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />}></Route>
          <Route path='login' element={<LoginPage />}></Route>
          <Route path='register' element={<RegisterPage />}></Route>
          <Route path='create' element={<CreatePage />}></Route>
          <Route path='post/:id' element={<PostPage />}></Route>
          <Route path='edit/:id' element={<EditPage />}></Route>
        </Route>
      </Routes>
    </UserContextProvider>

  )
}

export default App
