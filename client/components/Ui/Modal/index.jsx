import './Modal.scss';
import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

function Modal({ logo, title, left, right, children }) {
  return (
    <div className="modal">
      <div className="modal__dialog">
        <Link href="/">
          <a className="modal__logo block text-center">{logo}</a>
        </Link>
        <div className="modal__content">
          <div className="modal__content__header relative z-1">
            {left}
            <div className="text-4xl font-extrabold tracking-tightest absolute top-0 left-0 w-full h-full flex justify-center items-center -z-1 uppercase">
              {title}
            </div>
            {right}
          </div>
          <div className="modal__content__body">{children}</div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  logo: PropTypes.node,
  title: PropTypes.string.isRequired,
  left: PropTypes.node,
  right: PropTypes.node,
  children: PropTypes.node
};

export default Modal;