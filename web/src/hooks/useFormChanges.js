import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for detecting form changes and managing save button states
 *
 * @param {Object} initialData - The initial/saved data to compare against
 * @param {Object} currentData - The current form data
 * @param {Function} compareFunction - Optional custom comparison function
 * @returns {Object} - { hasChanges, isDirty, resetChanges, markAsSaved }
 */
export const useFormChanges = (
  initialData,
  currentData,
  compareFunction = null
) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialDataRef = useRef(initialData);

  // Update initial data ref when it changes (e.g., after successful save)
  useEffect(() => {
    initialDataRef.current = initialData;
    // Mark as initialized when we have real data (not empty object)
    if (initialData && Object.keys(initialData).length > 0) {
      setIsInitialized(true);
    }
  }, [initialData]);

  // Custom comparison function or default deep comparison
  const compareData = (initial, current) => {
    if (compareFunction) {
      return compareFunction(initial, current);
    }

    // Default deep comparison for objects
    if (typeof initial !== typeof current) {
      return false;
    }

    if (typeof initial !== 'object' || initial === null || current === null) {
      return initial === current;
    }

    if (Array.isArray(initial) !== Array.isArray(current)) {
      return false;
    }

    if (Array.isArray(initial)) {
      if (initial.length !== current.length) {
        return false;
      }
      return initial.every((item, index) => compareData(item, current[index]));
    }

    const initialKeys = Object.keys(initial);
    const currentKeys = Object.keys(current);

    if (initialKeys.length !== currentKeys.length) {
      return false;
    }

    return initialKeys.every(key => compareData(initial[key], current[key]));
  };

  // Check for changes whenever current data changes
  useEffect(() => {
    // Only check for changes if we have initialized data
    if (
      !isInitialized ||
      !initialDataRef.current ||
      Object.keys(initialDataRef.current).length === 0
    ) {
      setHasChanges(false);
      setIsDirty(false);
      return;
    }

    const changed = !compareData(initialDataRef.current, currentData);
    setHasChanges(changed);
    setIsDirty(changed);
  }, [currentData, isInitialized, compareFunction, compareData]);

  // Reset changes (useful after successful save)
  const resetChanges = () => {
    setHasChanges(false);
    setIsDirty(false);
  };

  // Mark as saved (updates initial data to current data)
  const markAsSaved = () => {
    initialDataRef.current = { ...currentData };
    resetChanges();
  };

  return {
    hasChanges,
    isDirty,
    resetChanges,
    markAsSaved,
    // Convenience property for button disabled state
    saveButtonDisabled: !hasChanges || !isDirty || !isInitialized,
  };
};

/**
 * Specialized hook for simple string/number form fields
 *
 * @param {any} initialValue - The initial value
 * @param {any} currentValue - The current value
 * @returns {Object} - { hasChanges, isDirty, resetChanges, markAsSaved }
 */
export const useSimpleFormChanges = (initialValue, currentValue) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    initialValueRef.current = initialValue;
    // Mark as initialized when we have a real value (not undefined/null)
    if (initialValue !== undefined && initialValue !== null) {
      setIsInitialized(true);
    }
  }, [initialValue]);

  useEffect(() => {
    // Only check for changes if we have initialized data
    if (!isInitialized || initialValueRef.current === undefined) {
      setHasChanges(false);
      setIsDirty(false);
      return;
    }

    const changed = initialValueRef.current !== currentValue;
    setHasChanges(changed);
    setIsDirty(changed);
  }, [currentValue, isInitialized]);

  const resetChanges = () => {
    setHasChanges(false);
    setIsDirty(false);
  };

  const markAsSaved = () => {
    initialValueRef.current = currentValue;
    resetChanges();
  };

  return {
    hasChanges,
    isDirty,
    resetChanges,
    markAsSaved,
    saveButtonDisabled: !hasChanges || !isDirty || !isInitialized,
  };
};
