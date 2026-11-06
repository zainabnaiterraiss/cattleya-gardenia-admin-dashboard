import { motion } from "framer-motion";

// ModalWrapper.jsx
const ModalWrapper = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay assombri */}
      <div
        className="fixed inset-0"
        style={{
          backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity, 1))",
          "--tw-bg-opacity": "0.5",
        }}
        onClick={onClose}
      />
      {/* Contenu du modal */}
      <div className="relative z-10 bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg ">
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;

