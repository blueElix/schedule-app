import { useState } from "react";
import { Container, Breadcrumbs, Link as MuiLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";

import { toastMsg } from "src/helpers/toast";
import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { createService } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import StyleLink from "src/components/StyleLink/StyleLink";

const CreateServices = () => {
  const [submitting, setSubmitting] = useState(false);
  const [user] = useLocalStorage("user");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Services name is required."),
      description: Yup.string().required("Services description is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        if (user) {
          await createService(values, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              "Content-Type": "application/json",
            },
          });
          setTimeout(() => {
            setSubmitting(false);
            router.push("/services");
            resetForm();
            toastMsg("success", "Successfully created service.");
          }, 300);
        }
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit}>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Services Name"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.name}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.description && formik.errors.description)}
          fullWidth
          helperText={formik.touched.description && formik.errors.description}
          label="Services Description"
          margin="normal"
          name="description"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.description}
          variant="outlined"
          multiline
          rows={4}
        />
        <Box sx={{ py: 2 }} textAlign="right">
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Container>
      <h1>Create Services</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/services">
          <StyleLink>Services</StyleLink>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Create Services
        </MuiLink>
      </Breadcrumbs>
      {renderForm()}
    </Container>
  );
};

CreateServices.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default CreateServices;
