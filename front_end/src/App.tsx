import React from 'react';
import { DAppProvider, ChainId } from "@usedapp/core";
import { Container } from "@material-ui/core";
import { Header } from "./components/header";
import { Main } from "./components/main";


function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan, ChainId.Rinkeby, 1337],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      }
    }}>
      <Header/>
      <Container maxWidth="md">
        <Main/>
      </Container>
    </DAppProvider>
  );
}

export default App;
