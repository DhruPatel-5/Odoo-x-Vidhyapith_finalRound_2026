import { useState, useCallback } from 'react';
import * as ecoApi from '../api/eco';

/**
 * Custom hook for ECO data management (page-level; for global use ECOContext).
 */
export const useECO = () => {
  const [ecos, setEcos] = useState([]);
  const [selectedECO, setSelectedECO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchECOs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ecoApi.getECOs();
      setEcos(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ECOs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchECOById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ecoApi.getECOById(id);
      setSelectedECO(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'ECO not found');
    } finally {
      setLoading(false);
    }
  }, []);

  const createECO = useCallback(async (data) => {
    const res = await ecoApi.createECO(data);
    setEcos((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const updateECO = useCallback(async (id, data) => {
    const res = await ecoApi.updateECO(id, data);
    setEcos((prev) => prev.map((e) => (e._id === id ? res.data : e)));
    return res.data;
  }, []);

  const validateECO = useCallback(async (id) => {
    const res = await ecoApi.validateECO(id);
    const updated = res.data?.eco || res.data;
    if (selectedECO?._id === id) setSelectedECO(updated);
    return updated;
  }, [selectedECO]);

  const approveECO = useCallback(async (id) => {
    const res = await ecoApi.approveECO(id);
    const updated = res.data?.eco || res.data;
    if (selectedECO?._id === id) setSelectedECO(updated);
    return updated;
  }, [selectedECO]);

  const applyECO = useCallback(async (id) => {
    const res = await ecoApi.applyECO(id);
    const updated = res.data?.eco || res.data;
    if (selectedECO?._id === id) setSelectedECO(updated);
    return updated;
  }, [selectedECO]);

  return {
    ecos, selectedECO, loading, error,
    fetchECOs, fetchECOById, createECO, updateECO,
    validateECO, approveECO, applyECO,
  };
};
