import { useEffect } from "react";
import { Container, Breadcrumbs, Link as StyleLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import { DashboardLayout } from "../../../components/dashboard-layout";
import { withAdmin } from "../../../helpers/auth";
import { barangays } from "src/__mocks__/barangays";
import Loader from "../../../components/Loader/Loader";

const EditBarangays = ({ barangay }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Barangay name is required."),
      address: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (barangay) {
      formik.setFieldValue("name", barangay.name);
      formik.setFieldValue("address", barangay.address);
    }
  }, []);

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit} style={{ marginTop: "10px" }}>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Barangay Name"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.name}
          variant="outlined"
        />

        <TextField
          error={Boolean(formik.touched.address && formik.errors.address)}
          fullWidth
          helperText={formik.touched.address && formik.errors.address}
          label="Barangay Address"
          margin="normal"
          name="address"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.address}
          variant="outlined"
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
      <h1>Edit Barangays</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <StyleLink underline="hover" color="inherit">
            Home
          </StyleLink>
        </Link>
        <Link href="/barangays">
          <StyleLink underline="hover" color="inherit">
            Barangays
          </StyleLink>
        </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Edit Barangay
        </StyleLink>
      </Breadcrumbs>
      {!barangay ? <Loader /> : renderForm()}
    </Container>
  );
};

EditBarangays.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _barangay = barangays.find(({ id }) => id == ctx.query.barangayId);
  return {
    props: {
      barangay: _barangay,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditBarangays;
