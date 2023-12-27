import { useEffect, useState } from 'react'
import Post from '../components/Post'

const baseURL = import.meta.env.VITE_BASE_URL;
const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${baseURL}/posts`).then
      ((response) => {
        response.json().then((posts) => {
          setPosts(posts);
        })
      });
  }, []);
  return (
    <>
     {
      posts.length > 0 && 
      posts.map((posts) => {
        return <Post key={posts.id} {...post} />
      })
     } 
    </>
  )
}

export default IndexPage