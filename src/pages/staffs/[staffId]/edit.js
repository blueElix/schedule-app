import { useEffect, useState } from "react";
import {
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";

import * as Yup from "yup";
import Link from "next/link";
import InputMask from "react-input-mask";

import { DashboardLayout } from "src/components/DashboadLayout";
import { withAdmin } from "../../../helpers/auth";
import { users } from "src/__mocks__/users";
import { services } from "src/__mocks__/services";
import { toastMsg } from "src/helpers/toast";
import Loader from "src/components/Loader/Loader";
import StyleLink from "src/components/StyleLink/StyleLink";
import { updateStaff, getStaff, getBarangays, getServices } from "src/api";
import useLocalStorage from "src/hooks/useLocalStorage";

const EditStaffs = ({ staff, currentId, barangays, services }) => {
  const [submitting, setSubmitting] = useState(false);
  const [user] = useLocalStorage("user");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contact: "",
      type: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Staff name is required."),
      contact: Yup.string(),
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Staff email is required"),
      type: Yup.string().required("Staff type is required."),
      role: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          serviceId: values.services == "" ? null : values.services,
          barangayId: values.barangays == "" ? null : values.barangays,
          email: values.email,
          fullName: values.name,
          role: values.role,
          contact: values.contact,
          type: values.type,
          role:
            values.type === "BARANGAY_STAFF"
              ? "BARANGAY"
              : values.type === "SERVICE_STAFF"
              ? "SERVICE"
              : "STAFF",
        };

        const res = await updateStaff(currentId, payload, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        setSubmitting(true);
        toastMsg("success", "Successfully updated staff.");
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    if (staff) {
      formik.setFieldValue("name", staff.full_name);
      formik.setFieldValue("contact", staff.contact);
      formik.setFieldValue("email", staff.email);
      formik.setFieldValue("type", staff.type);
      formik.setFieldValue("role", staff.role);
    } else {
      toastMsg("error", `Selected staff didn't load.`);
    }
  }, []);

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit}>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          fullWidth
          helperText={formik.touched.name && formik.errors.name}
          label="Staff Full Name"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.name}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Staff Email Address"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
          variant="outlined"
        />
        <FormControl error={Boolean(formik.touched.type && formik.errors.type)} margin="normal">
          <FormLabel id="staffType">Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="staffType"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            <FormControlLabel value="SERVICE_STAFF" control={<Radio />} label="Service Staff" />
            <FormControlLabel value="BARANGAY_STAFF" control={<Radio />} label="Barangay Staff" />
            <FormControlLabel value="STAFF" control={<Radio />} label="Staff" />
          </RadioGroup>
          <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
        </FormControl>

        <InputMask
          mask="(+63) 999 999 9999"
          value={formik.values.contact}
          onChange={(e) => formik.setFieldValue("contact", e.target.value)}
        >
          {(inputProps) => (
            <TextField
              error={Boolean(formik.touched.contact && formik.errors.contact)}
              fullWidth
              helperText={formik.touched.contact && formik.errors.contact}
              label="Staff Contact"
              margin="normal"
              name="contact"
              type="text"
              variant="outlined"
              {...inputProps}
            />
          )}
        </InputMask>

        {formik.values.type === "SERVICE_STAFF" && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="selectServices">Services</InputLabel>
            <Select
              labelId="selectServices"
              id="demo-simple-select"
              value={formik.values.services}
              label="Services"
              name="services"
              onChange={formik.handleChange}
            >
              {Array.isArray(services) && services.length > 0 ? (
                services.map((service) => (
                  <MenuItem value={service.id} key={service.id}>
                    {service.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No services available</MenuItem>
              )}
            </Select>
          </FormControl>
        )}

        {formik.values.type === "BARANGAY_STAFF" && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="selectBarangay">Barangay</InputLabel>
            <Select
              labelId="selectBarangay"
              id="demo-simple-select"
              value={formik.values.barangays}
              label="Barangay"
              name="barangays"
              onChange={formik.handleChange}
            >
              {Array.isArray(barangays) && barangays.length > 0 ? (
                barangays.map((barangay) => (
                  <MenuItem value={barangay.id} key={barangay.id}>
                    {barangay.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No barangay available</MenuItem>
              )}
            </Select>
          </FormControl>
        )}

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
      <h1>Edit Staff</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <StyleLink>Home</StyleLink>
        </Link>
        <Link href="/staffs">
          <StyleLink>Staffs</StyleLink>
        </Link>
        <MuiLink
          color="text.primary"
          aria-current="page"
          sx={{
            textDecoration: "none",
          }}
        >
          Edit Staff
        </MuiLink>
      </Breadcrumbs>
      {!staff ? <Loader /> : renderForm()}
    </Container>
  );
};

EditStaffs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const token = ctx.req.headers.cookie.split(";").find((c) => c.trim().startsWith(`token=`));
  const tokenValue = token.split("=")[1];

  const { data: _staff } = await getStaff(ctx.query.staffId, {
    headers: {
      Authorization: `Bearer ${tokenValue}`,
      "Content-Type": "application/json",
    },
  });

  const { data: _barangays } = await getBarangays(
    {
      headers: {
        Authorization: `Bearer ${tokenValue}`,
        "Content-Type": "application/json",
      },
    },
    {
      limit: 1000,
      page: 1,
      sort: "created_at",
      search: "",
    }
  );

  const { data: _services } = await getServices(
    {
      headers: {
        Authorization: `Bearer ${tokenValue}`,
        "Content-Type": "application/json",
      },
    },
    {
      limit: 1000,
      page: 1,
      sort: "created_at",
      search: "",
    }
  );

  return {
    props: {
      staff: _staff.data || null,
      currentId: ctx.query.staffId,
      barangays: _barangays.data,
      services: _services.data,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditStaffs;
