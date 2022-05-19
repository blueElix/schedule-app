import { useState } from "react";
import Link from "next/link";
import { Container, Stack, Button } from "@mui/material";

import { DashboardLayout } from "../../components/DashboadLayout";
import { withAdmin } from "../../helpers/auth";
import { users as _staffs } from "src/__mocks__/users";
import StaffsTable from "src/components/StaffsTable/StaffsTable";
import SearchForm from "src/components/SearchForm/SearchForm";
import Loader from "src/components/Loader/Loader";

const Dashboard = (props) => {
  const [staffs, setStaffs] = useState(props.staffs);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSearch = (value) => {
    setIsLoading(true);
    setStaffs(staffs.filter(({ name }) => name.toLowerCase().startsWith(value.toLowerCase())));
    setIsLoading(false);
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Staffs</h1>

        <Stack direction="row" spacing={2}>
          <SearchForm onSearch={handleOnSearch} resetSearch={() => setStaffs(props.staffs)} />
          <Link href="staffs/new">
            <Button variant="contained">Create staffs</Button>
          </Link>
        </Stack>
      </Stack>

      {isLoading || !staffs ? <Loader /> : <StaffsTable staffs={staffs} setStaffs={setStaffs} />}
    </Container>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const getProps = async (ctx) => {
  return {
    props: { staffs: _staffs },
  };
};

export const getServerSideProps = withAdmin(getProps);

export default Dashboard;
