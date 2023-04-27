import React, { useEffect } from 'react';
import { map, filter } from 'rxjs/operators';
import { bind } from '@react-rxjs/core';
import {
    createSignal,
} from "@react-rxjs/utils";
import {Observable} from "rxjs";


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
export const [useSocket] = bind(socket$, null);

const [ready$, onReady] = createSignal<boolean>();
export const [useReady] = bind(ready$, false);

const [newConnector$, onNewConnector] = createSignal<Record<Message['id'], Message>>();
export const [useConnectors] = bind(newConnector$, {} as Record<Message['id'], Message>);

const [newConnectorValue$, onNewConnectorValue] = createSignal<Record<Message['id'], Message>>();
export const [useConnectorValues] = bind(newConnectorValue$, {} as Record<Message['id'], Message>);

export const [useConnectorValue] = bind((id: string): Observable<any> => newConnectorValue$.pipe(filter((item:Record<string, Message>): boolean => item[id] ? item[id].connected : !!item.connected), map((item) => item[id])), { connected: true});

export const Websocket: any = () => {
    const socket: WebSocket | null = useSocket();
    const connectors = useConnectors();
    const connectorValues: Record<string, Message> = useConnectorValues();
    const message: Message = useMessage();

    useEffect(() => {
        onNewSocket(new WebSocket("ws://localhost:5000"));
        return () => {
            if (!socket) return;
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
        if (!socket) return;
        socket.onopen = () => onReady(true);
        socket.onclose = () => onReady(false);
        socket.onmessage = (event: any) => {
            onNewMessage(JSON.parse(event.data));
        }
    }, [socket]);

    return (<></>);
};
