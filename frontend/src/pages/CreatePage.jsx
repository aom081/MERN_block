import React, { useState } from 'react'
import Editor from '../components/Editor'
const baseURL = import.meta.env.VITE_BASE_URL;
import { Navigate } from "react-router-dom";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect,setRedirect] = useState("");

  const createPost = async (e) => {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    Date.set("file", files[0]);
    e.preventDefault();
    const response = await fetch(`${baseURL}/post`, {
      method: "POST",
      body: data,
      credentials:"include",
    });
    if (response.ok) {
      setRedirect(true)
    }
  }

  return (
    <form onSubmit={createPost}>
      <input type="text" 
      name='title' 
      value={title} 
      placeholder='title' 
      onChange={(e) => setTitle(e.target.value)}
      />
      <input type="text" 
      name='summary'
      value={summary} 
      placeholder='summary' 
      onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" 
      name='file' 
      id='file ' 
      onChange={(e) => setFiles(e.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button> Create post </button>
    </form>
  )
}

export default CreatePage