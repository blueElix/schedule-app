import { useEffect, useState } from "react";
import { Container, Breadcrumbs, Link as StyleLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import { DashboardLayout } from "../../../components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { services } from "src/__mocks__/services";
import Loader from "../../../components/Loader/Loader";
import { toastMsg } from "../../../helpers/toast";

const EditServices = ({ service }) => {
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Services name is required."),
      description: Yup.string(),
    }),
    onSubmit: (values) => {
      try {
        setSubmitting(true);
        console.log(values);
        setSubmitting(false);
        toastMsg("success", "Successfully updated services.");
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    if (service) {
      formik.setFieldValue("name", service.name);
      formik.setFieldValue("description", service.description);
    } else {
      toastMsg("error", `Selected services didn't load.`);
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
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  return (
    <Container>
      <h1>Edit Service</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">Home </Link>
        <Link href="/services">Services </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Edit Service
        </StyleLink>
      </Breadcrumbs>
      {!service ? <Loader /> : renderForm()}
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
