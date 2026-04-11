"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface ModalContextType {
  isAnyModalOpen: boolean;
  modalImage: string | null;
  modalAlt: string;
  modalLayoutId: string | undefined;
  openModalWith: (src: string, alt: string, layoutId: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isAnyModalOpen: false,
  modalImage: null,
  modalAlt: "",
  modalLayoutId: undefined,
  openModalWith: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalAlt, setModalAlt] = useState("");
  const [modalLayoutId, setModalLayoutId] = useState<string | undefined>(undefined);

  const openModalWith = useCallback((src: string, alt: string, layoutId: string) => {
    setModalImage(src);
    setModalAlt(alt);
    setModalLayoutId(layoutId);
    setIsAnyModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsAnyModalOpen(false);
    // Keep image/layoutId alive until layout animation finishes
    setTimeout(() => {
      setModalImage(null);
      setModalAlt("");
      setModalLayoutId(undefined);
    }, 600);
  }, []);

  return (
    <ModalContext.Provider
      value={{ isAnyModalOpen, modalImage, modalAlt, modalLayoutId, openModalWith, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
