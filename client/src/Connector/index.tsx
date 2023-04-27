import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Stack from 'react-bootstrap/Stack';

import { useConnectorValue, useSocket } from '../socket';

type ConnectorProps = {
    eventId: string,
    eventName: string,
    visible: string,
}

const Connector = ({ eventId, eventName, visible }: ConnectorProps) => {
    // @ts-ignore
    const event: any = useConnectorValue(eventId);
    const[connState, setConnState ] = useState(event?.connected || false);
    const [shouldDisplay, setShouldDisplay] = useState(visible === 'all' || connState)
    const socket = useSocket();

    useEffect(() => {
        setShouldDisplay(visible === 'all' || connState);
    }, [visible]);

    const toggle = () => {
        socket?.send(JSON.stringify({ command: connState ? 'disconnect' : 'connect', id: eventId }));
        setConnState((prev: boolean) => !prev);
        setShouldDisplay(visible === 'all' || !connState);
    };

    return (
        <Card style={{ opacity: shouldDisplay ? '1' : '0', pointerEvents: shouldDisplay ? 'all' : 'none' }}>
            <Card.Body>
                <Stack gap={3}>
                    <Button variant={connState ? 'success' : 'danger'} onClick={toggle}>{connState ? 'disconnect' : 'connect'}</Button>
                    <div>{eventName} {event?.value} {event?.unit}</div>
                </Stack>
            </Card.Body>
        </Card>
    );
};

export default Connector;
