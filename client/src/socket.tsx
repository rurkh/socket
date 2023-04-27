import React, { useEffect } from 'react';
import { map, filter } from 'rxjs/operators';
import { bind } from '@react-rxjs/core';
import {
    createSignal,
} from "@react-rxjs/utils";


type Message = {
    id: string,
    connected: boolean,
    name: string,
    unit: string,
    value: string | null,
};

const [newMessage$, onNewMessage] = createSignal<Message>();
export const [useMessage] = bind(newMessage$, {} as Message);

const [socket$, onNewSocket] = createSignal<WebSocket>();
export const [useSocket] = bind(socket$, {} as WebSocket);

const [ready$, onReady] = createSignal<boolean>();
export const [useReady] = bind(ready$, false);

const [newConnector$, onNewConnector] = createSignal<Record<Message['id'], Message>>();
export const [useConnectors] = bind(newConnector$, {} as Record<Message['id'], Message>);

const [newConnectorValue$, onNewConnectorValue] = createSignal<Record<Message['id'], Message>>();
export const [useConnectorValues] = bind(newConnectorValue$, {} as Record<Message['id'], Message>);

export const [useConnectorValue] = bind((id: string): any => newConnectorValue$.pipe(filter((item:Record<string, Message>): boolean => item[id] ? item[id].connected : !!item.connected), map((item: Record<string, Message>) => item[id])), { connected: true});

export const Websocket: any = () => {
    const socket: WebSocket = useSocket();
    const connectors = useConnectors();
    const connectorValues: Record<string, Message> = useConnectorValues();
    const message: Message = useMessage();

    useEffect(() => {
        onNewSocket(new WebSocket("ws://localhost:5000"));
        return () => {
            if (!socket.url) return;
            socket.close();
        };
    }, []);

    useEffect(() => {
        const { id, ...rest } = message;
        if (!connectors[id] && id) {
            const { connected } = rest;
            onNewConnector({ ...connectors, [id]: { ...rest } } as Record<Message['id'], Message>);
            if (!connected) {
                socket?.send(JSON.stringify({ command: 'connect', id }));
            }
        } else if (id) {
            const { value, unit, connected } = rest;
            onNewConnectorValue({ ...connectorValues, [id]: { value, unit, id, connected } } as Record<Message['id'], Message>);
        }
    }, [message]);

    useEffect(() => {
        console.log('ll', socket.url, socket);
        if (!socket.url) return;
        socket.onopen = () => onReady(true);
        socket.onclose = () => onReady(false);
        socket.onmessage = (event: any) => {
            onNewMessage(JSON.parse(event.data));
        }
    }, [socket]);

    return (<></>);
};
