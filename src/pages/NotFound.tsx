import { Typography, Container } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography>
        The page you're looking for doesn't exist.
      </Typography>
    </Container>
  );
};

export default NotFound;
