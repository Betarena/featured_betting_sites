/**
 * This INTERFACE represents the data
 * structure recieved from the Real-Time DB
 * for a specific language location Featured 
 * Betting Site Widget
*/
export interface FeaturedSite {
    position: number            // featured betting site position in the board
    featured_image: string      // featured image of betting site (large-top-3) URL
    image: string               // regular logo-image of betting site
    name: string                // name of the featured betting site
    rating: number              // rating given to the featured betting site
    bonus: string               // bonus prize money of the featured betting site
    description: string         // featured betting site dsctiption referral condition
    conditions: string          // featured site T&Cs
    cta_link: string            // `call-to-action` link for the featured betting site
    conditions_head: string     // heading-value of the `conditions`
}

/**
 * This it the INTERFACE that represents the data
 * structre for the response given from the parsed data
 * on the DB.
*/ 
export interface FinalFeaturedSiteResponseDB {
    site_data_array: Array< FeaturedSite >      // contains the array of `FeaturedSite` data from the website
    site_data_array_length: number              // lenght of the array with the number of featured sites
    title: string                               // contains the `geo-locational` title name of the widget
    show_more_less: string[]                    // show more less widget data translations [0] = 'showMore', [1] = 'showLess'
}