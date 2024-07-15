import React, { useState } from "react"; // Import React and useState for managing component state
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation after login
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  IconButton,
  InputAdornment
} from "@mui/material"; // Import Material-UI components for UI
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"; // Import icon for the avatar
import Visibility from "@mui/icons-material/Visibility"; // Import visibility icon for showing password
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Import visibility off icon for hiding password
import { createTheme, ThemeProvider } from "@mui/material/styles"; // Import theme creation and ThemeProvider for Material-UI theming

// Create a custom theme using Material-UI
const theme = createTheme();

function Login() {
  // State variables to manage form inputs and state
  const [username, setUsername] = useState(""); // State for username input
  const [password, setPassword] = useState(""); // State for password input
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  // Function to toggle the visibility of the password
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setError(""); // Clear any previous error messages

    try {
      // Make a POST request to the login endpoint
      const response = await axios.post(
        "http://localhost:5000/users/login",
        {
          userName: username, // Pass the username
          password: password, // Pass the password
        },
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );

      console.log("Login successful", response.data); // Log the successful response
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Navigate to dashboard and pass user data
      navigate("/dashboard", { state: { user: response.data.user } });
    } catch (err) {
      // Handle errors and set error message
      setError(err.response?.data?.error || "An error occurred during login");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className="login-container">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon /> {/* Display lock icon in avatar */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in {/* Display "Sign in" heading */}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username} // Bind the username state to the input value
              onChange={(e) => setUsername(e.target.value)} // Update username state on input change
              className="custom-text-field"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"} // Toggle password visibility
              id="password"
              autoComplete="current-password"
              value={password} // Bind the password state to the input value
              onChange={(e) => setPassword(e.target.value)} // Update password state on input change
              className="custom-text-field"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword} // Toggle password visibility on icon click
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />} {/* Display appropriate icon based on password visibility */}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <Alert severity="error" className="custom-alert">{error}</Alert>} {/* Display error message if any */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className="custom-button"
            >
              Sign In {/* Submit button */}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" className="custom-link">
                  Forgot password? {/* Link for password recovery */}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login; // Export the Login component
