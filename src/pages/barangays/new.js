import { useState } from "react";
import { Container, Breadcrumbs, Link as MuiLink, Box, Button, TextField } from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/router";

import { createBarangay } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import { toastMsg } from "src/helpers/toast";
import { withAdmin } from "../../helpers/auth";
import { DashboardLayout } from "src/components/DashboadLayout";

const CreateBarangays = () => {
  const [submitting, setSubmitting] = useState(false);
  const [user] = useLocalStorage("user");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Barangay name is required."),
      address: Yup.string().required("Barangay address is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);
        if (user) {
          const res = await createBarangay(values, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              "Content-Type": "application/json",
            },
          });
          setTimeout(() => {
            setSubmitting(false);
            resetForm();
            router.push("/barangays");
            toastMsg("success", "Successfully created barangay.");
          }, 300);
        }
      } catch (error) {
        if (error.response.data.message) {
          toastMsg("error", error.response.data.message);
        } else {
          toastMsg("error", "Something went wrong.");
        }
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
      <h1>Create Barangay</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/barangays">
          <a className="styleLink">Barangays</a>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Create Barangay
        </MuiLink>
      </Breadcrumbs>
      {renderForm()}
    </Container>
  );
};

CreateBarangays.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default CreateBarangays;
