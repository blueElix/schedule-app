import { Container, Breadcrumbs, Link as StyleLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import { DashboardLayout } from "../../../components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { services } from "src/__mocks__/services";
import { useEffect } from "react";
import Loader from "../../../components/Loader/Loader";

const EditServices = ({ service }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Services name is required."),
      description: Yup.string(),
    }),
    onSubmit: () => {
      alert();
    },
  });

  useEffect(() => {
    if (service) {
      formik.setFieldValue("name", service.name);
      formik.setFieldValue("description", service.description);
    }
  }, []);

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit} style={{ marginTop: "10px" }}>
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
            {formik.isSubmitting ? "Submitting" : "Submit"}
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Container>
      <h1>Edit Service</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <StyleLink underline="hover" color="inherit">
          <Link href="/">Home </Link>
        </StyleLink>
        <StyleLink underline="hover" color="inherit">
          <Link href="/services">Services </Link>
        </StyleLink>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Edit Service
        </StyleLink>
      </Breadcrumbs>
      {service ? <Loader /> : renderForm()}
    </Container>
  );
};

EditServices.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _service = services.find(({ id }) => id == ctx.query.serviceId);
  return {
    props: {
      service: _service,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditServices;
