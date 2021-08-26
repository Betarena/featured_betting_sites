import { get } from '../api/utils'

import { 
    db,
    db_real 
} from '../firebase/index'

import type { 
    GeoJsResponse
} from "../models/geo-js-interface";

import type {
    FeaturedSite,
    FinalFeaturedSiteResponseDB
} from "../models/firebase-real-db-interface"; 

/**
 * A simple quick & easy function
 * to populate the DB with data,
 * [ONE TIME - DISPOISABLE - DEV ONLY]
*/
export function writeData() {
    // example data writing;

    let countryArr = [
        'be', 
        'co', 
        // 'en', //
        'gb',
        'es', 
        'pt',
    ]
    let betSitesArr = [
        'bet365',
        '1xbet',
        '22Bet',
        'Betboro',
        'Betfair',
        'bet365'
    ]
    countryArr.forEach(lang => {
        betSitesArr.forEach(featuredData => {
            let counter = 1
            let data: FeaturedSite = {
                position: counter,
                featured_image: 'https://www.betarena.com/wp-content/uploads/2021/08/bet-365_ad.svg',
                image: 'https://www.betarena.com/wp-content/uploads/2021/08/bet-365_ad.svg',
                name: featuredData,
                rating: 4,
                bonus: '500',
                description: `Open an account with bet365 today and bet on a huge 
                                range of markets with the world’s favourite online sports betting company.`,
                conditions: 'No code required',
                cta_link: 'https://qg9t2.app.goo.gl/bet365_general',
            }
            counter++
            // write the data to the `real-db`;
            db_real.ref('featured_betting_sites/' + lang + '/' + featuredData).set(data)
            console.info('Data for' + `${lang}` + 'Written!')
        })
        db_real.ref('featured_betting_sites/' + lang).update({'title': 'Top Bookmekers from the US'})
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
 export async function getUserGeoFeaturedDB(userGeoLocation: GeoJsResponse): Promise < FinalFeaturedSiteResponseDB > {
    // extract the user location data country code;
    let userCountryCode = userGeoLocation.country_code
    // console.info('userCountryCode', userCountryCode)

    // retrun the respective country data location of the featured betting site;
    return db_real.ref().child('featured_betting_sites').child(userCountryCode.toLowerCase()).get().then((snapshot) => {
        // check if the data exists (should exist at all times);
        if (snapshot.exists()) {
            // console.info('data from Real DB', snapshot.val())
            
            // converting returned response (object) to an (array);
            let featuredSitesArr: Array < FeaturedSite > = Object.values(snapshot.val()) as unknown as Array< FeaturedSite >;

            // intercept the `title` object from the array;
            let title: string = featuredSitesArr.at(-1)
            // remove the `title` object form the array;
            featuredSitesArr = featuredSitesArr.slice(0,-1)

            // prettify the object correctly, and prepare for returning it;
            let finalResponseDB: FinalFeaturedSiteResponseDB = {
                site_data_array: featuredSitesArr,         
                site_data_array_length: featuredSitesArr.length,
                title: title
            }
            
            // return the response as an Array;
            return finalResponseDB
        } else {
            throw new Error('Data from DB is incorrect');
        }
    })
}

/**
 * Description:
 * ~~~~~~~~~~~~~~~~~
 * Checks for the users location
 * and stores it for future use
*/
 export async function getUserLocation(): Promise < GeoJsResponse > {
    const response = await get(`https://get.geojs.io/v1/ip/geo.json`)
    // console.info('GoeJS Response', response)
    return response
}