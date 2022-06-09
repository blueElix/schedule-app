import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Stack, Button, Box, TextField } from "@mui/material";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withUser } from "../../helpers/auth";
import useLocalStorage from "src/hooks/useLocalStorage";
import { changePassword } from "src/api";
import { toastMsg } from "src/helpers/toast";

const ChangePassword = (props) => {
  const [user] = useLocalStorage("user");

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().max(255).required("Current Password is required"),
      newPassword: Yup.string().max(255).required("New Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm your new password is required.")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          currentPassword: values.oldPassword,
          newPassword: values.newPassword,
        };

        const res = await changePassword(payload, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (res) {
          toastMsg("success", "Successfully update your password.");
        }

        resetForm();
      } catch (error) {
        if (error.response.data.message) {
          toastMsg("error", error.response.data.message);
        } else {
          toastMsg("error", "Something went wrong.");
        }
      }
    },
  });
  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Change Password</h1>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          error={Boolean(formik.touched.oldPassword && formik.errors.oldPassword)}
          fullWidth
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          label="Enter current password"
          margin="normal"
          name="oldPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.oldPassword}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.newPassword && formik.errors.newPassword)}
          fullWidth
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          label="Enter new password"
          margin="normal"
          name="newPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.newPassword}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
          fullWidth
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          label="Confirm your new password"
          margin="normal"
          name="confirmPassword"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.confirmPassword}
          variant="outlined"
        />

        <Box sx={{ py: 2 }}>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

ChangePassword.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: {},
  };
};

export const getServerSideProps = withUser(getProps);

export default ChangePassword;
