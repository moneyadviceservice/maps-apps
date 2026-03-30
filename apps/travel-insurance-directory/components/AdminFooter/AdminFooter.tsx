import { Container } from '@maps-react/core/components/Container';

export const AdminFooter = () => (
  <footer className="bg-gray-500 print:hidden" data-testid="admin-footer">
    <Container className="py-6">
      <p className="text-sm text-gray-100">
        &copy; {new Date().getFullYear()} Money and Pensions Service
      </p>
    </Container>
  </footer>
);
