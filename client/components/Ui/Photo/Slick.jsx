import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Slider from "react-slick";
import ArrowLeft from "./ArrowLeft";
import ArrowRight from "./ArrowRight";

function PrevArrow({ className, currentSlide, onClick }) {
  const disabled = currentSlide <= 0;

  return (
    <div className={className} onClick={onClick}>
      <ArrowLeft
        className={disabled ? "stroke-divider" : "stroke-red"}
        width="6"
        height="13"
      />
    </div>
  );
}

function NextArrow({ className, currentSlide, onClick }) {
  const disabled = currentSlide >= 3;

  return (
    <div className={className} onClick={onClick}>
      <ArrowRight
        className={disabled ? "stroke-divider" : "stroke-red"}
        width="6"
        height="13"
      />
    </div>
  );
}

function Slick({ id, photos, labels, available, slider, className }) {
  const [sliderCardId, setSliderCardId] = useState(null);

  const [mainNav, setMainNav] = useState(null);
  const [secondNav, setSecondNav] = useState(null);

  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);

  useEffect(() => {
    setMainNav(slider1);
    setSecondNav(slider2);
  });

  const images = photos.map(photo => photo.thumb_url);
  const isActiveSlider = sliderCardId === id && slider;

  return (
    <div
      className={cx("relative", className)}
      onMouseEnter={() => (available ? null : setSliderCardId(id))}
      onMouseLeave={() => (available ? null : setSliderCardId(null))}
    >
      <Slider
        className="relative block"
        asNavFor={secondNav}
        arrows={false}
        ref={slider => setSlider1(slider)}
      >
        {images.map((image, i) => (
          <img
            key={i}
            className={cx("object-cover", className)}
            src={image}
            alt=""
          />
        ))}
      </Slider>

      {labels && (
        <div
          className={cx(
            "absolute inset-0 flex flex-row justify-between items-end p-3",
            isActiveSlider ? "mb-22-5" : null
          )}
        >
          {labels}
        </div>
      )}

      {isActiveSlider && (
        <div className="absolute inset-0 hidden lg:flex flex-col lg:justify-end">
          <div className="slider px-6 pt-3">
            <Slider
              asNavFor={mainNav}
              ref={slider => setSlider2(slider)}
              slidesToShow={5}
              infinite={false}
              swipeToSlide={true}
              focusOnSelect={true}
              adaptiveHeight
              nextArrow={<NextArrow className="prev-arrow" />}
              prevArrow={<PrevArrow className="next-arrow" />}
            >
              {images.map((image, i) => (
                <img
                  key={i}
                  className="object-cover rounded-lg h-15 outline-none cursor-pointer"
                  src={image}
                  alt=""
                />
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
}

Slick.defaultProps = {
  className: "h-photo sm:h-photo-sm md:h-photo-md lg:h-photo-lg hd:h-photo-hd"
};

Slick.propTypes = {
  className: PropTypes.string,
  photos: PropTypes.array,
  labels: PropTypes.node,
  slider: PropTypes.bool,
  available: PropTypes.bool
};

export default Slick;
