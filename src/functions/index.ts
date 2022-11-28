import { get } from "../api/utils";

import { db, db_real } from "../firebase/index";

import type { GeoJsResponse } from "../models/geo-js-interface";

import type {
  FeaturedSite,
  FinalFeaturedSiteResponseDB,
} from "../models/firebase-real-db-interface";

/**
 * A simple quick & easy function
 * to populate the DB with data,
 * [ONE TIME - DISPOISABLE - DEV ONLY]
 */
export function writeData() {
  // example data writing;

  let countryArr = [
    // 'be',
    // 'co',
    // 'en', //
    // 'gb',
    // 'es',
    // 'pt',/
  ];
  let betSitesArr = [
    "bet365",
    "1xbet",
    "22Bet",
    "Betboro",
    "Betfair",
    "bet365",
  ];
  countryArr.forEach((lang) => {
    betSitesArr.forEach((featuredData) => {
      let counter = 1;
      let data: FeaturedSite = {
        position: counter,
        featured_image:
          "https://www.betarena.com/wp-content/uploads/2021/08/bet-365_ad.svg",
        image:
          "https://www.betarena.com/wp-content/uploads/2021/08/bet-365_ad.svg",
        name: featuredData,
        rating: 4,
        bonus: "500",
        description: `Open an account with bet365 today and bet on a huge 
                                range of markets with the world’s favourite online sports betting company.`,
        conditions: "No code required",
        conditions_head: "200% Bonus up to $200",
        cta_link: "https://qg9t2.app.goo.gl/bet365_general",
      };
      counter++;
      // write the data to the `real-db`;
      db_real
        .ref("featured_betting_sites/" + lang + "/" + featuredData)
        .update(data);
      console.info("Data for" + `${lang}` + "Written!");
    });
    db_real
      .ref("featured_betting_sites/" + lang)
      .update({ title: "Top Bookmekers from the US" });
    db_real
      .ref("featured_betting_sites/" + lang)
      .update({ show_more_less: ["Show full list", "Show less"] });
  });
}

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * Obtain the data from the `real_db` firebase DB
 * according to the users current geo-location
 *
 * @param userGeoLocation
 */
export async function getUserGeoFeaturedDB(
  userGeoLocation: GeoJsResponse
): Promise<FinalFeaturedSiteResponseDB> {
  // extract the user location data country code;
  let userCountryCode = userGeoLocation.country_code;
  // console.info('userCountryCode', userCountryCode)

  // retrun the respective country data location of the featured betting site;
  return db_real
    .ref()
    .child("featured_betting_sites")
    .child(userCountryCode.toLowerCase())
    .get()
    .then((snapshot) => {
      // check if the data exists (should exist at all times);
      if (snapshot.exists()) {
        // console.info('data from Real DB', [snapshot.val()])

        // converting returned response (object) to an (array);
        // let featuredSitesArr: Array < FeaturedSite > = Object.values(snapshot.val()) as unknown as Array< FeaturedSite >;
        let featuredSitesArr: Array<FeaturedSite> = Object.entries(
          snapshot.val()
        ) as unknown as Array<FeaturedSite>;

        // convert object values to MAP;
        var map = new Map(featuredSitesArr);

        // intercept the `title` object from the Map ARRAY;
        // & remove it from the MAP;
        let title: string = map.get("title");
        map.delete("title");

        // interpect the `show_more_less` from the Map Array;
        // & remove it from the MAP;
        let show_more_less: string[] = map.get("show_more_less");
        map.delete("show_more_less");

        featuredSitesArr = [...map.values()];
        // console.log('featuredSitesArr', featuredSitesArr)

        // filter values by position in order of ascending
        featuredSitesArr.sort(
          (a, b) => parseInt(a.position) - parseInt(b.position)
        );
        // console.log('featuredSitesArr', featuredSitesArr)

        // prettify the object correctly, and prepare for returning it;
        let finalResponseDB: FinalFeaturedSiteResponseDB = {
          site_data_array: featuredSitesArr,
          site_data_array_length: featuredSitesArr.length,
          title: title,
          show_more_less: show_more_less,
        };

        // return the response as an Array;
        return finalResponseDB;
      } else {
        throw new Error("Data from DB is incorrect");
      }
    });
}

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * Checks for the users location
 * and stores it for future use
 */
export async function getUserLocation(): Promise<GeoJsResponse> {
  const response = await get(`https://get.geojs.io/v1/ip/geo.json`);
  // console.info('GoeJS Response', response)
  return response;
}
