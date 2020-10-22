import React from 'react';
import { Container, Layout } from 'components';

const NotFoundPage = () => {
  return (
    <Layout>
      <Container type="content" className="text-center">
        <h1>Pagina non trovata</h1>
        <p>Pagina inesistente, torna indietro.</p>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;
