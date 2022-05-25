import NextLink from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageNotFound = ({
  title = "Page not found",
  linkLabel = "Go back to dashboard",
  link = "/",
}) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography align="center" color="textPrimary" variant="h5">
          {title}
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <img
            alt="Under development"
            src="/static/images/undraw_page_not_found_su7k.svg"
            style={{
              marginTop: 50,
              display: "inline-block",
              maxWidth: "100%",
              width: 300,
            }}
          />
        </Box>
        <NextLink href={link} passHref>
          <Button
            component="a"
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={{ mt: 3 }}
            variant="contained"
          >
            {linkLabel}
          </Button>
        </NextLink>
      </Box>
    </Container>
  );
};

export default PageNotFound;
