import { useEffect, useState } from "react";
import { Container, Breadcrumbs, Link as StyleLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import { DashboardLayout } from "../../../components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { toastMsg } from "../../../helpers/toast";
import { getBarangay, updateBarangay } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import Loader from "../../../components/Loader/Loader";

const EditBarangays = ({ barangay, currentId }) => {
  const [submitting, setSubmitting] = useState(false);
  const [user] = useLocalStorage("user");

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Barangay name is required."),
      address: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        if (user) {
          await updateBarangay(currentId, values, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              "Content-Type": "application/json",
            },
          });
          setTimeout(() => {
            setSubmitting(false);
            toastMsg("success", "Successfully updated barangay.");
          }, 300);
        }
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    if (barangay) {
      formik.setFieldValue("name", barangay.name);
      formik.setFieldValue("address", barangay.address);
    } else {
      toastMsg("error", `Selected barangay didn't load.`);
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
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
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
        <Link href="/">Home </Link>
        <Link href="/barangays">Barangays </Link>
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
  const { data: _barangay } = await getBarangay(ctx.query.barangayId);
  return {
    props: {
      barangay: _barangay[0],
      currentId: ctx.query.barangayId,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditBarangays;
