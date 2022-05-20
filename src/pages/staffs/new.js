import { useState } from "react";
import {
  Container,
  Breadcrumbs,
  Link as StyleLink,
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
import { useRouter } from "next/router";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { services } from "src/__mocks__/services";
import { toastMsg } from "../../helpers/toast";

const CreateStaffs = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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
    onSubmit: (values, { resetForm }) => {
      try {
        setSubmitting(true);
        console.log(values);
        setTimeout(() => {
          setSubmitting(false);
          router.push("/staffs");
          resetForm();
          toastMsg("success", "Successfully created staff.");
        }, 300);
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
            <FormControlLabel value="service-staff" control={<Radio />} label="Service Staff" />
            <FormControlLabel value="barangay-staff" control={<Radio />} label="Barangay Staff" />
            <FormControlLabel value="staff" control={<Radio />} label="Staff" />
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

        <FormControl fullWidth margin="normal">
          <InputLabel id="selectRole">Role</InputLabel>
          <Select
            labelId="selectRole"
            id="demo-simple-select"
            value={formik.values.role}
            label="Role"
            name="role"
            onChange={formik.handleChange}
          >
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => (
                <MenuItem value={service.id} key={service.id}>
                  {service.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No role available</MenuItem>
            )}
          </Select>
        </FormControl>

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
      <h1>Create Staffs</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">Home</Link>
        <Link href="/staffs">Staffs</Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Create Staffs
        </StyleLink>
      </Breadcrumbs>
      {renderForm()}
    </Container>
  );
};

CreateStaffs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAdmin(getProps);

export default CreateStaffs;
