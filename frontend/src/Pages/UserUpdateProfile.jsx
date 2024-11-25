import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Alert, Avatar, Box, Card, CardContent, CardHeader, Grid } from '@mui/material';

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentProfileImage, setCurrentProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Set the fetched data
        setUsername(response.data.username);
        setEmail(response.data.email);
        setCurrentProfileImage(response.data.profileImage);
      } catch (error) {
        setErrorMessage('Error fetching profile data');
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('No token found, please log in again');
      return;
    }

    if (!username || !email) {
      setErrorMessage('Username and email are required.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put('http://localhost:4000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(response.data.message);
      setErrorMessage('');

      // Navigate to /home after a successful profile update
      setTimeout(() => {
        navigate('/home');
      }, 1500); // Optional delay to allow user to see the success message
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ minHeight: '100vh', alignItems: 'center' }}>
      <Grid item xs={12} sm={8} md={6}>
        <Card elevation={3} sx={{ padding: 3 }}>
          <CardHeader title="Edit Profile" titleTypographyProps={{ variant: 'h5' }} />
          <CardContent>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>Profile Picture</Typography>
                {currentProfileImage ? (
                  <Avatar
                    src={currentProfileImage}
                    alt="Profile Preview"
                    sx={{
                      width: 120,
                      height: 120,
                      marginBottom: 2,
                      border: '2px solid #3f51b5',
                      boxShadow: 2,
                    }}
                  />
                ) : (
                  <Avatar sx={{ width: 120, height: 120, marginBottom: 2, border: '2px solid #3f51b5', boxShadow: 2 }} />
                )}

                <input
                  type="file"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  accept="image/*"
                  style={{ marginBottom: 16 }}
                />
              </Box>

              <Button variant="contained" color="primary" type="submit" fullWidth>
                Save Changes
              </Button>
            </form>

            {errorMessage && <Alert severity="error" sx={{ marginTop: 2 }}>{errorMessage}</Alert>}
            {successMessage && <Alert severity="success" sx={{ marginTop: 2 }}>{successMessage}</Alert>}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default EditProfile;
