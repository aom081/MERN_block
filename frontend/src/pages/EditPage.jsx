import  {useEffect, useState } from 'react'
import Editor from '../components/Editor'
import { useParams, Navigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_BASE_URL;

const EditPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect,setRedirect] = useState("");

  useEffect(() => {
    fetch(`${baseURL}/posts/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      });
    });
  }, [id]);

  const UpdatePost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("id", id);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
      if (files?.[0]) {
        data.set("file", files[0]);
      }
      const response = await fetch(`${baseURL}/post`, {
        method: "PUT",
        body: data,
        credentials:"include",
      });
      if (response.ok) {
        setRedirect(true)
      }
    };
   
  return (
    <form onSubmit={UpdatePost}>
      <input 
      type="text" 
      name='title' 
      value={title} 
      placeholder='title' 
      onChange={(e) => setTitle(e.target.value)}
      />
      <input 
      type="text" 
      name='summary'
      value={summary} 
      placeholder='summary' 
      onChange={(e) => setSummary(e.target.value)}
      />
      <input 
      type="file" 
      name='file' 
      id='file ' 
      onChange={(e) => setFiles(e.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button> Edit post </button>
    </form>
  )
}

export default EditPage
