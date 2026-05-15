import { useEffect, useState, useCallback } from "react";
import { getSocket } from "../sockets/socket.js";

const useSocket = (pollId) => {
    const [connected, setConnected] = useState(false);
    const [liveCount, setLiveCount] = useState(null);  // live response count
    const [analytics, setAnalytics] = useState(null);  // real-time analytics

    const socket = getSocket();

    const emit = useCallback((event, data) => {
        if (socket.connected) {
            socket.emit(event, data);
        }
    }, [socket]);

    useEffect(() => {
        // connect if not already
        if (!socket.connected) socket.connect();

        const onConnect = () => {
            setConnected(true);
            if (pollId) socket.emit("join-poll", pollId);
        };

        const onDisconnect = () => {
            setConnected(false);
        };

        const onReconnect = () => {
            setConnected(true);
            // re-join poll room after reconnect
            if (pollId) socket.emit("join-poll", pollId);
        };

        const onLiveCount = (count) => {
            setLiveCount(count);
        };

        const onAnalyticsUpdate = (updatedAnalytics) => {
            setAnalytics(updatedAnalytics);
        };

        // register listeners
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("reconnect", onReconnect);
        socket.on("live-count", onLiveCount);
        socket.on("analytics-update", onAnalyticsUpdate);

        if (socket.connected && pollId) {
            Promise.resolve().then(() => {
                setConnected(true);
            });
            socket.emit("join-poll", pollId);
        }
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("reconnect", onReconnect);
            socket.off("live-count", onLiveCount);
            socket.off("analytics-update", onAnalyticsUpdate);

            if (pollId) socket.emit("leave-poll", pollId);
        };
    }, [pollId, socket]);

    return {
        socket,
        connected,
        liveCount,   
        analytics,   
        emit,
    };
};

export default useSocket;