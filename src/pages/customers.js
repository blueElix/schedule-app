import { Box, Container } from "@mui/material";
import { CustomerListResults } from "../components/customer/customer-list-results";
import { CustomerListToolbar } from "../components/customer/customer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";

const Customers = () => (
  <Container maxWidth={false}>
    <CustomerListToolbar />
    <Box sx={{ mt: 3 }}>
      <CustomerListResults customers={customers} />
    </Box>
  </Container>
);
Customers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Customers;
