import { useEffect, useState } from "react";
import { Container, Breadcrumbs, Link as MuiLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { toastMsg } from "src/helpers/toast";
import { getBarangay, updateBarangay } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import Loader from "src/components/Loader/Loader";
import PageNotFound from "src/components/PageNotFound/PageNotFound";

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
      address: Yup.string().required("Barangay address is required."),
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
        setSubmitting(false);
        if (error.response.data.message) {
          toastMsg("error", error.response.data.message);
        } else {
          toastMsg("error", "Something went wrong.");
        }
      }
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
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  if (!barangay) {
    return (
      <PageNotFound
        title="Barangay not found"
        linkLabel="Go back to Barangays List"
        link="/barangays"
      />
    );
  }
  return (
    <Container>
      <h1>Edit Barangays</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/barangays">
          <a className="styleLink"> Barangays</a>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Edit Barangay
        </MuiLink>
      </Breadcrumbs>
      {!barangay ? <Loader /> : renderForm()}
    </Container>
  );
};

EditBarangays.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _barangay } = await getBarangay(ctx.query.barangayId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      barangay: _barangay.data || null,
      currentId: ctx.query.barangayId,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditBarangays;
