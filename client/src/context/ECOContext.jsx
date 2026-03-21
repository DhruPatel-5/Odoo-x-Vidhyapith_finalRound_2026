import { createContext, useContext, useState, useCallback } from 'react';
import * as ecoApi from '../api/eco';

const ECOContext = createContext(null);

/**
 * ECOContext provider — global ECO list and selected ECO state.
 * Provides data fetching and mutation functions to ECO components.
 */
export const ECOProvider = ({ children }) => {
  const [ecos, setEcos] = useState([]);
  const [selectedECO, setSelectedECO] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Fetch all ECOs. */
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

  /** Fetch a single ECO by id and set as selectedECO. */
  const fetchECOById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ecoApi.getECOById(id);
      setSelectedECO(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load ECO');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Validate ECO (move to next stage without approval). */
  const validateECO = useCallback(async (id) => {
    const res = await ecoApi.validateECO(id);
    if (selectedECO?._id === id) setSelectedECO(res.data?.eco || res.data);
    return res.data;
  }, [selectedECO]);

  /** Approve ECO (approver action). */
  const approveECO = useCallback(async (id) => {
    const res = await ecoApi.approveECO(id);
    if (selectedECO?._id === id) setSelectedECO(res.data?.eco || res.data);
    return res.data;
  }, [selectedECO]);

  return (
    <ECOContext.Provider value={{
      ecos, selectedECO, loading, error,
      fetchECOs, fetchECOById, validateECO, approveECO,
    }}>
      {children}
    </ECOContext.Provider>
  );
};

export const useECOContext = () => {
  const ctx = useContext(ECOContext);
  if (!ctx) throw new Error('useECOContext must be used inside ECOProvider');
  return ctx;
};

export default ECOContext;
