import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';

import { useConnectors } from './socket';
import Connector from './Connector';
import './App.css';

function App() {
  const connectors = useConnectors();
  const [ displayState, setDisplayState ] = useState<string>('all');

  const toggledisplayState = () => {
    setDisplayState(prev => prev === 'all' ? 'connected' : 'all');
  };

  return (
    <Container>
    <Stack gap={3}>
      <Button variant="primary" onClick={toggledisplayState}>{ displayState === 'all' ? 'Show only connected' : 'Show All'}</Button>
      <Container className="App">
        <Stack gap={3}>
        <Row xs={2} md={2} lg={2}>
          {Object.keys(connectors).map((key: string, i: number) => {
            const event = connectors[key];

            return (
                    <Connector key={`${key}_${event.name}_${i}`} visible={displayState} eventId={key} eventName={event.name} />
                )
          })}
        </Row>
        </Stack>
      </Container>
    </Stack>
    </Container>
  );
}

export default App;
