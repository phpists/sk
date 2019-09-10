import PropTypes from "prop-types";

export default function WebsiteSvg({ fill }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 8.5C16 12.6421 12.6421 16 8.5 16M16 8.5C16 4.35786 12.6421 1 8.5 1M16 8.5H1M8.5 16C4.35786 16 1 12.6421 1 8.5M8.5 16C10.376 13.9462 11.4421 11.281 11.5 8.5C11.4421 5.71903 10.376 3.05376 8.5 1M8.5 16C6.62404 13.9462 5.55794 11.281 5.5 8.5C5.55794 5.71903 6.62404 3.05376 8.5 1M1 8.5C1 4.35786 4.35786 1 8.5 1"
        stroke="#FF3366"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

WebsiteSvg.propTypes = {
  fill: PropTypes.string
};

WebsiteSvg.defaultProps = {
  fill: "none"
};
