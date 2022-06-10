import { useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Container, Link, TextField, Typography, Alert } from "@mui/material";
import { authenticate, isAuth } from "../helpers/auth";
import useLocalStorage from "src/hooks/useLocalStorage";
import { login } from "src/api";
import { toastMsg } from "src/helpers/toast";

const Login = () => {
  const router = useRouter();
  const [_, setUser] = useLocalStorage("user", null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().max(255).required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const { data: user } = await login({ email: values.email, password: values.password });
        setUser(user);

        setTimeout(() => {
          setIsSubmitting(false);
          authenticate(user.accessToken, () => {
            isAuth() && user.user.role === "ADMIN" ? router.push("/") : router.push("/bookings");
          });
          toastMsg("success", user.message);
        }, 200);
      } catch (err) {
        setError(err);
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    isAuth() && router.push("/");
  }, []);

  return (
    <>
      <Head>
        <title>Login | Schedule App</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color="textPrimary" variant="h4">
                Sign in
              </Typography>
            </Box>
            {error && (
              <Alert severity="error">
                Please make sure you have enter correct email and password.
              </Alert>
            )}
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                {isSubmitting ? "Submitting" : "Sign In Now"}
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
