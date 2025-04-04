import axios from 'axios';
import React, { useState } from 'react'
import FooterComponent from './Footer';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('http://localhost:5000/api/users/forgotpassword', { email })
          .then(res => {
              if (res.data.success) {
                alert("your password reset link was sent to your gmail.")
                  navigate('/login');

              } else {
                  console.error(res.data.error);
              }
          })
          .catch(err => console.error(err));
  };

  return (
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
          <div className="bg-white p-3 rounded w-25">
              <h2>Forgot Password</h2>
              <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                      <label htmlFor="email">
                          <strong>Email</strong>
                      </label>
                      <input
                          type="email"
                          placeholder="Enter Email"
                          autoComplete="off"
                          name="email"
                          className="form-control rounded-0"
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <button type="submit" className="btn btn-success w-100 rounded-0">
                      Submit
                  </button>
              </form>
          </div>
      </div>
  );
}

