import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";

import useLocalStorage from "src/hooks/useLocalStorage";
import { updateStaff, getStaff } from "src/api";
import { toastMsg } from "src/helpers/toast";
import Link from "next/link";

export const AccountProfileDetails = (props) => {
  const [user] = useLocalStorage("user");

  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Client name is required."),
      contact: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const payload = {
          fullName: values.name,
          contact: values.contact,
        };
        const res = await updateStaff(user.user.id, payload, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        setSubmitting(false);
        toastMsg("success", "Successfully updated booking.");
      } catch (error) {
        toastMsg("error", "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    const init = async () => {
      try {
        const { data: profile } = await getStaff(user.user.id, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (profile.data) {
          formik.setFieldValue("name", profile.data.full_name || "");
          formik.setFieldValue("contact", profile.data.contact || "");
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <Card>
      <form onSubmit={formik.handleSubmit}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <CardHeader subheader="The information can be edited" title="Profile" />
          <Box sx={{ margin: 2 }} textAlign="right">
            <Link href="change-password">
              <Button variant="contained" margin={5}>
                Change Password
              </Button>
            </Link>
          </Box>
        </Stack>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Full Name"
                margin="normal"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
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
                    label="Contact"
                    margin="normal"
                    name="contact"
                    type="text"
                    variant="outlined"
                    {...inputProps}
                  />
                )}
              </InputMask>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Box sx={{ py: 2 }} textAlign="right">
            <Button color="primary" disabled={submitting} type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </Card>
  );
};
