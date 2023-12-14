import React from 'react'

const LoginPage = () => {
  return (
    <form className='login'>
      <h1>login</h1>
      <input type="text" name='username' placeholder='username' />
      <input type="password" name='password' placeholder='password' />
      <button> login </button>
    </form>
  )
}

export default LoginPage