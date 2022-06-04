import { useEffect, useState } from "react";
import { Container, Breadcrumbs, Link as MuiLink, Box, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import Loader from "src/components/Loader/Loader";
import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { toastMsg } from "src/helpers/toast";
import { getService, updateService } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";
import StyleLink from "src/components/StyleLink/StyleLink";
import PageNotFound from "src/components/PageNotFound/PageNotFound";

const EditServices = ({ service, currentId }) => {
  const [submitting, setSubmitting] = useState(false);
  const [user] = useLocalStorage("user");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Services name is required."),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        if (user) {
          await updateService(currentId, values, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              "Content-Type": "application/json",
            },
          });
          setTimeout(() => {
            setSubmitting(false);
            toastMsg("success", "Successfully updated services.");
          }, 300);
        }
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
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
          <Button color="primary" disabled={submitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };

  if (!service) {
    return (
      <PageNotFound
        title="Services not found"
        linkLabel="Go back to Services List"
        link="/services"
      />
    );
  }

  return (
    <Container>
      <h1>Edit Service</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/services">
          <a className="styleLink">Services </a>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Edit Service
        </MuiLink>
      </Breadcrumbs>
      {!service ? <Loader /> : renderForm()}
    </Container>
  );
};

EditServices.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _service } = await getService(ctx.query.serviceId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });
  return {
    props: {
      service: _service.data || null,
      currentId: ctx.query.serviceId,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditServices;
