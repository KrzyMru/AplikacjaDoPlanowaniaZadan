import React from "react";
import { Box, Grid, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';

const SignUp = () => {

    const [loading, setLoading] = React.useState(false);
    const [response, setResponse] = React.useState(null);

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        } else if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Invalid email address.';
        }

        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length > 0 && values.password[0] !== values.password[0].toUpperCase()) {
            errors.password = 'Password must start with capital letter.';
        } else if (/^[a-zA-Z0-9]+$/?.test(values.password)) {
            errors.password = 'Password must contain at least one non-alphanumeric character.';
        } else if (!/\d/.test(values.password)) {
            errors.password = 'Password must contain at least one digit.';
        } else if (values.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long.';
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate,
        onSubmit: async (values) => {
            validate(values);
            try {
                setLoading(true);
                setResponse(null);
                const response = await fetch("https://localhost:7241/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "*/*"
                    },
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    setResponse({ status: true, message: "Account created successfully! You may sign in now." });
                }
                else
                    setResponse({ status: false, message: "Something went wrong, please try again later." });
            } catch (error) {
                setResponse({ status: false, message: "Something went wrong, please try again later." });
            } finally {
                setLoading(false);
            }
        },
    });

    React.useEffect(() => {
        if (formik) {
            formik.validateForm();
        }
    }, []);

    return (
        <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={24}
                    sx={{
                        borderRadius: '20px',
                        display: 'flex', flexDirection: 'row',
                        flexGrow: 1, overflow: 'hidden',
                        maxWidth: '450px', height: 'fit-content',
                        p: 3,
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.errors.email !== undefined}
                                helperText={formik.errors.email}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.errors.password !== undefined}
                                helperText={formik.errors.password}
                            />
                        </FormControl>
                        {
                            response &&
                            <Alert severity={response?.status ? "success" : "error"} sx={{ mb: 1 }}>
                                {response?.message}
                            </Alert>
                        }
                        <Box sx={{ display: 'flex', position: 'relative', justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    width: 'fit-content',
                                    px: 5
                                }}
                                disabled={
                                    loading ||
                                    formik.errors.email !== undefined ||
                                    formik.errors.password !== undefined
                                }
                            >
                                Sign Up
                            </Button>
                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                        color: 'orange'
                                    }}
                                />
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Link to="/signIn" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SignUp;