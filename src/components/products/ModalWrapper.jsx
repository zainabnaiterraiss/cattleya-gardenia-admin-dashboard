import ReactDOM from "react-dom";

const ModalWrapper = ({ children }) => {
    return ReactDOM.createPortal(children, document.body);
};

export default ModalWrapper;
