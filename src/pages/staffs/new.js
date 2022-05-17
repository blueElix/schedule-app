import { Container, Breadcrumbs, Link as StyleLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import { DashboardLayout } from "../../components/dashboard-layout";
import { withAdmin } from "../../helpers/auth";

const CreateServices = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Services name is required."),
      description: Yup.string(),
    }),
    onSubmit: () => {},
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
          <Button color="primary" disabled={formik.isSubmitting} type="submit" variant="contained">
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
          <StyleLink underline="hover" color="inherit">
            Home
          </StyleLink>
        </Link>
        <Link href="/services">
          <StyleLink underline="hover" color="inherit">
            Services
          </StyleLink>
        </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Create Services
        </StyleLink>
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
