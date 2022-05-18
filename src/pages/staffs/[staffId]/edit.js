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

import { DashboardLayout } from "../../../components/dashboard-layout";
import { withAdmin } from "../../../helpers/auth";
import { users } from "src/__mocks__/users";
import { services } from "src/__mocks__/services";
import { useEffect } from "react";

const EditStaffs = ({ staff }) => {
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
    onSubmit: () => {},
  });

  useEffect(() => {
    if (staff) {
      formik.setFieldValue("name", staff.name);
      formik.setFieldValue("contact", staff.contact);
      formik.setFieldValue("email", staff.email);
      formik.setFieldValue("type", staff.type);
      formik.setFieldValue("role", staff.role);
    }
  }, []);

  const renderForm = () => {
    return (
      <form onSubmit={formik.handleSubmit} style={{ marginTop: "10px" }}>
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
        <FormControl error={Boolean(formik.touched.type && formik.errors.type)} margin="normal">
          <FormLabel id="staffType">Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="staffType"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
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
          <Button color="primary" disabled={formik.isSubmitting} type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </form>
    );
  };
  return (
    <Container>
      <h1>Edit Staffs</h1>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          <StyleLink underline="hover" color="inherit">
            Home
          </StyleLink>
        </Link>
        <Link href="/staffs">
          <StyleLink underline="hover" color="inherit">
            Staffs
          </StyleLink>
        </Link>
        <StyleLink underline="hover" color="text.primary" aria-current="page">
          Edit Staffs
        </StyleLink>
      </Breadcrumbs>
      {renderForm()}
    </Container>
  );
};

EditStaffs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  const _staff = users.find(({ id }) => id == ctx.query.staffId);
  return {
    props: {
      staff: _staff,
    },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default EditStaffs;
