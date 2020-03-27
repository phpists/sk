import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import Link from "next/link";

import { Button } from "UI";
import { FavoriteButton } from "components/favorite";
import GoogleMap from "components/GoogleMap";
import { WebsiteSvg, FavoriteSvg, MapSvg, CloseSvg, RatingSvg } from "icons";
import Distance from "components/distance";
import MapDirection from "components/maps/MapDirection";
import EntityMaps from "components/maps/EntityMaps";
import {useTranslation} from "react-i18next";

function DistanceView({distanceKm}) {
  if (!distanceKm) {
    return '';
  }

  const {t, i18n} = useTranslation();

  return (
    <p className="text-grey">{distanceKm} {t('index.km_from_me')}</p>
  );
}

function ClubCard({ id, name, city, favorited, phones, photos, gridClasses = true, lat, lng, logo, start_time, end_time, employees}) {
  let phone;
  const [showNumber, setToggleNumber] = useState(false);
  const [eventMapId, setEventMapId] = useState(null);

  const [thumb] = photos;

  const phonesList = JSON.parse(phones);

  if (phonesList.length) {
    const [number] = phonesList;
    phone = number
  }
  const logo_url = (logo !== null) ? logo['url'] : "/static/img/club-logo.png";
  const isMap = eventMapId === id;
  const city_name = (city !== null) ? city['name'] : "";
  const {t, i18n} = useTranslation();

  function renderTime(start_time, end_time) {

    if (!start_time || !end_time) {
      return '';
    }

    const start = start_time ? start_time.substring(0,5) : "";
    const end = end_time ? end_time.substring(0,5) : "";

    return (
      <div className="px-3 c-events-time inline-block">
        {start} - {end}
      </div>
    )
  }
  return (
    <div
      className={cx([
        "relative overflow-hidden mb-6 px-3 rounded-t-lg",
        gridClasses ? "w-full md:w-1/2 lg:w-1/3 hd:w-1/4" : "",
      ])}
      key={id}
    >
      <div
        className="relative overflow-hidden rounded-t-lg c-events-card"
        style={{
          backgroundImage: `url(${thumb && thumb.url || '/static/img/club-none.png'})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 335
        }}
      >
        {/* Extract to component */}
        {isMap ? (
          <div
            className="absolute z-30 top-0 right-0 p-3-5"
            onClick={() => setEventMapId(null)}
          >
            <button className="flex justify-center content-center rounded-full bg-white w-10 h-10">
              <CloseSvg></CloseSvg>
            </button>
          </div>
        ) : (
          <div className="absolute z-20 top-0 right-0 p-3-5">
            <FavoriteButton
              variables={{ model_id: id, model_type: "club" }}
              favorited={favorited}
              small={true}
              iconWidth={18}
              iconHeight={16}
            />
          </div>
        )}
        <div className="absolute bottom-0 mb-10 font-black text-white">
          {renderTime(start_time, end_time)}
          <div className="px-3 inline-block mb-2 c-events-time">{employees.length || 0} workers</div>
        </div>
        <div className="absolute bottom-0 left-0 p-4 mt-2 text-2xl font-black text-white hover:text-red cursor-pointer z-30">
          <Link href="/clubs/[id]/information" as={`/clubs/${id}/information`}>
            <a>{name}</a>
          </Link>
        </div>
      </div>
      <div className="bg-white p-5 rounded-b-lg">
        <div className="flex justify-between text-xs cursor-pointer">
          <div className="flex flex-col pr-4">
            <p className="py-1 font-bold ml-2" onClick={() => setEventMapId(id)}>
              {city_name}
            </p>
            {(lat && lng) &&
              <Distance
                originByGeo={true}
                destination={{lat, lng}}
              >
                <DistanceView/>
              </Distance>
            }

            <div className="flex">
              {phone && (<div className="flex bg-xs-grey px-3 py-1 mt-2 rounded-full">
                <span
                  className={cx("block whitespace-no-wrap overflow-hidden", {
                    "w-8": !showNumber
                  })}
                >
                  {phone}
                </span>
                {!showNumber && (
                  <span
                    className="ml-4 text-red whitespace-no-wrap"
                    onClick={() => setToggleNumber(!showNumber)}
                  >
                    {t('about.clubs.show_number')}
                  </span>
                )}
              </div>)}
            </div>
            <div className="flex flex-col relative mt-3">
              <div className="flex">
                <RatingSvg className="mx-1"/>
                <RatingSvg className="mx-1"/>
                <RatingSvg className="mx-1"/>
                <RatingSvg className="mx-1"/>
              </div>
              <div className="ml-2">(23 {t('about.clubs.reviews')})</div>
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="logo-small__div">
              <img src={logo_url} alt="" />
            </div>
            <div className="flex mt-2">
              <WebsiteSvg></WebsiteSvg>
              <span className="ml-1 whitespace-no-wrap text-grey">
                {t('index.visit_site')}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isMap && (
        <div>
          <div
            className="google-map absolute top-0 left-0 z-20 px-3"
            style={{ height: "100%", width: "100%" }}
          >
            <EntityMaps
              entity={{lat, lng}}
              height="100%"
              goBtnLeft={true}
            />
          </div>

          <div className="absolute bottom-0 left-0 z-30 p-6">
            <Button className="px-6" size="sm">
             {t('employees.get_me')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

ClubCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  start_time: PropTypes.string,
  end_time: PropTypes.string,
  // gridClasses: PropTypes.boolean,
  photos: PropTypes.array
};

export default ClubCard;
