// src/Pages/Profile.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Avatar, Grid, TextField, Button } from '@mui/material';

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.id) {
        setError('No user ID found.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for user ID:', user.id); // Debugging
        const response = await axios.get(`http://localhost:5000/users/${user.id}`, {
          withCredentials: true,
        });
        console.log('Profile data:', response.data); // Debugging
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile data.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${user.id}`, profile, {
        withCredentials: true,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          {profile.firstName ? profile.firstName[0] : '?'}
        </Avatar>
        <Typography component="h1" variant="h5">
          My Profile
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                fullWidth
                label="First Name"
                value={profile.firstName || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                fullWidth
                label="Last Name"
                value={profile.lastName || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                fullWidth
                label="Email"
                value={profile.email || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="username"
                fullWidth
                label="Username"
                value={profile.userName || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Profile;
