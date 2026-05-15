import { useState } from "react";

import {
    createPoll,
    deletePoll,
    getPollAnalytics,
    getPollById,
    getPollByShareId,
    publishPoll,
    updatePoll,
} from "../api/poll.api.js";

const usePoll = () => {

    const [poll, setPoll] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreatePoll = async (pollData) => {

        try {
            setLoading(true);
            const data = await createPoll(pollData);
            setPoll(data.poll);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePoll = async (pollId, pollData) => {
        try {
            setLoading(true);
            const data = await updatePoll(pollId, pollData);
            setPoll(data.poll);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update poll");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePoll = async (pollId) => {
        try {
            setLoading(true);
            const data = await deletePoll(pollId);
            setPoll(null);
            return data;
        } catch (err) {
            setError(err.response?.data?.message ||"Failed to delete poll");
        } finally {
            setLoading(false);
        }
    };

    const fetchPollById = async (pollId) => {
        try {
            setLoading(true);
            const data = await getPollById(pollId);
            setPoll(data.poll);
        } catch (err) {
            setError(err.response?.data?.message ||"Failed to fetch poll");
        } finally {
            setLoading(false);
        }
    };

    const fetchPollByShareId = async (shareId) => {
        try {
            setLoading(true);
            const data = await getPollByShareId(shareId);
            setPoll(data.poll);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch poll"
            );

        } finally {
            setLoading(false);
        }
    };

    const handlePublishPoll = async (pollId) => {
        try {
            setLoading(true);
            const data = await publishPoll(pollId);
            setPoll(data.poll);
            return data;
        } catch (err) {
            setError( err.response?.data?.message || "Failed to publish poll" );
        } finally {
            setLoading(false);
        }
    };

    const fetchPollAnalytics = async (pollId) => {
        try {
            setLoading(true);
            const data = await getPollAnalytics(pollId);
            setAnalytics(data.analytics);
        } catch (err) {
            setError( err.response?.data?.message || "Failed to fetch analytics" );
        } finally {
            setLoading(false);
        }
    };

    return {
        poll,
        analytics,
        loading,
        error,
        handleCreatePoll,
        handleUpdatePoll,
        handleDeletePoll,
        fetchPollById,
        fetchPollByShareId,
        handlePublishPoll,
        fetchPollAnalytics,
    };
};

export default usePoll;