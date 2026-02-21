"use client";

import KidsModeDemo from "./KidsModeDemo";

interface TryMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TryMeModal({ isOpen, onClose }: TryMeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <KidsModeDemo onClose={onClose} />
    </div>
  );
}
