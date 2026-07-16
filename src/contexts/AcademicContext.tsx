'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AcademicContextType {
  branchId: string | null;
  semesterId: string | null;
  branchName: string | null;
  semesterNum: string | null;
  isSetupComplete: boolean;
  updateAcademicSetup: (branchId: string, branchName: string, semesterId: string, semesterNum: string) => void;
  clearSetup: () => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [semesterId, setSemesterId] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);
  const [semesterNum, setSemesterNum] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bId = localStorage.getItem('userBranchId');
      const sId = localStorage.getItem('userSemesterId');
      const bName = localStorage.getItem('userBranchName');
      const sNum = localStorage.getItem('userSemesterNumber');

      setBranchId(bId);
      setSemesterId(sId);
      setBranchName(bName);
      setSemesterNum(sNum);
      setIsLoaded(true);
    }
  }, []);

  const updateAcademicSetup = (bId: string, bName: string, sId: string, sNum: string) => {
    setBranchId(bId);
    setBranchName(bName);
    setSemesterId(sId);
    setSemesterNum(sNum);

    if (typeof window !== 'undefined') {
      localStorage.setItem('userBranchId', bId);
      localStorage.setItem('userBranchName', bName);
      localStorage.setItem('userSemesterId', sId);
      localStorage.setItem('userSemesterNumber', sNum);
    }
  };

  const clearSetup = () => {
    setBranchId(null);
    setBranchName(null);
    setSemesterId(null);
    setSemesterNum(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('userBranchId');
      localStorage.removeItem('userBranchName');
      localStorage.removeItem('userSemesterId');
      localStorage.removeItem('userSemesterNumber');
    }
  };

  return (
    <AcademicContext.Provider
      value={{
        branchId,
        semesterId,
        branchName,
        semesterNum,
        isSetupComplete: isLoaded && Boolean(branchId && semesterId),
        updateAcademicSetup,
        clearSetup,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
