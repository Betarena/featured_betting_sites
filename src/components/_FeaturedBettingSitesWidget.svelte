<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->
<script lang="ts">
  import {
    writeData,
    getUserLocation,
    getUserGeoFeaturedDB,
  } from "../functions/index";

  import type {
    ContentLoaderProps
  } from "../models/content-loader-interface";

  import type {
    FinalFeaturedSiteResponseDB,
  } from "../models/firebase-real-db-interface"; 

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  import ContentLoader from "svelte-content-loader";
  import FeaturedSiteRow from "./_FeaturedSiteRow.svelte";

  import GoldCup from "./_GoldCup.svelte";
  import SilverCup from "./_SilverCup.svelte";
  import BronzeCup from "./_BronzeCup.svelte";

  // write data to the DB; (Single Use)
  // writeData()

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * Intializer of the Widget Function
   *
   * Returns INTERFACE - `FinalFeaturedSiteResponseDB`
  */
  let trueLengthOfArray: number
  async function widgetInit(): Promise < FinalFeaturedSiteResponseDB > {
    // determine the users location;
    let userGeoInfo = await getUserLocation();
    // retrieve the appropiate information from the DB;
    let db_real_data = await getUserGeoFeaturedDB(userGeoInfo);
    // interpect the number of `actual` rows on the data array;
    trueLengthOfArray = db_real_data.site_data_array_length
    // return the FINAL Promise Value;
    return db_real_data;
  }
  let promise = widgetInit();

  /**
   * Decalring the ContentLoaderProps
   * values through the interface
  */
  let contentLoaderProps: ContentLoaderProps = {
    width: `100%`,
    height: `100%`,
    primaryColor: "#f9f9f9",
  }

  let staticViewRow: number // holds the `initial` number of featured sites to be displayed
  let limitViewRow: number  // holds the actual, `total` limit of the list of featured sites
  let showMore: boolean = false // signals to other widget values that the lsit has expanded
  let displayShowMore: boolean = false // signal as to whether to display or not the `showMore` / `showLess` data container;

  $: if (viewportDesktop) {

    if (trueLengthOfArray > 10) {
      displayShowMore = true
      staticViewRow = 10
      limitViewRow = 10
    }
  } else {

    if (trueLengthOfArray > 5) {
      displayShowMore = true
      staticViewRow = 5
      limitViewRow = 5
    }
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * Toggling the Show/Hide of the
   * list of featured site for the website;
  */
  function toggleFullList() {
    // update the showMore Boolean
    showMore = !showMore
    // check if the `limitViewRow` matches the `trueLengthOfArray`,
    if (limitViewRow == trueLengthOfArray) {
      // if so, revert back to the original number of list row items,
      limitViewRow = staticViewRow
      return
    }
    // otherwise, expand the list to the full length,
    limitViewRow = trueLengthOfArray
  }

  /**
   * Description:
   * ~~~~~~~~~~~~~~~~~~~
   * onMount() function that verifies that
   * the `viewport` width is of tablet size
   * or greater;
  */
  let viewportDesktop: boolean;

  onMount(async() => {
      var wInit = document.documentElement.clientWidth;
      if (wInit > 767) {
          viewportDesktop = true;
      } else {
          viewportDesktop = false;
      }
      window.addEventListener("resize", function() {
          var w = document.documentElement.clientWidth;
          if (w > 767) {
              viewportDesktop = true;
          } else {
              viewportDesktop = false;
          }
      })
  })
</script>

<style>
  #featured-list-container {
    display: grid;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    width: 100%;
    max-width: 343px;
  }

  #title-box {
    padding: 24px 60px 20px 60px;
    text-align: center;
    white-space: nowrap;
  }

  #show-more-box {
    padding: 25px 130px;
    text-align: center;
    white-space: nowrap;
    color: var(--primary);
    box-shadow: inset 0px 1px 0px #EBEBEB;
    cursor: pointer;
  }

  @media only screen and (min-width: 767px) {

    #featured-rank {
      display: grid;
      gap: 10px;
      padding: 23px 43px 16px 43px;
      background: #F2F2F2;
      border-radius: 12px;
      justify-items: center;
    }

    #feature-rank-display {
      display: grid;
      gap: 20px;
      grid-auto-flow: column;
      grid-template-columns: repeat(3, 1fr);
      justify-content: space-between;
      padding: 20px 20px 0 20px;
    }

    #featured-list-container {
      width: 100%;
      max-width: 700px;
    }
  }

  @media only screen and (min-width: 1024px) {

    #feature-rank-display {
      display: grid;
      gap: 20px;
      grid-auto-flow: column;
      grid-template-columns: repeat(3, 1fr);
      justify-content: space-between;
      padding: 20px 20px 0 20px;
    }

    #featured-rank {
      display: grid;
      gap: 10px;
      padding: 23px 16px 16px 16px;
      background: #F2F2F2;
      border-radius: 12px;
      justify-items: center;
    }

    #featured-list-container {
      width: 100%;
      max-width: 560px;
    }
  }
</style>

{#await promise}
  <!-- 
  ~~~~~~~~~~~~~~~
  promise is pending -->
  <ContentLoader {...contentLoaderProps} />
{:then value}
  <!-- 
  ~~~~~~~~~~~~~~~
  promise was fulfilled -->
  <div id='featured-list-container'>
    <!-- 
    ~~~~~~~~~~~~~~~
    top 3 featured sites 
    TABLET / DEKTOP VIEW ONLY -->
    {#if viewportDesktop}
      <div id='feature-rank-display' 
        in:fade>
        <!--
        ~~~~~~~~~~~~~~~
        RANK 2 LOGO -->
        <a target="_blank" rel="noreferrer" href="">
          <div id='featured-rank' style='margin-top: 20px;'>
            <SilverCup imageURL={value.site_data_array[1].image} />
            <!-- 
            Featured Image Details -->
            <p class='x-large'>{value.site_data_array[1].name}</p>
            <p class='large' style='color: #8C8C8C;'>Rank 2</p>
          </div>
        </a>
        <!--
        ~~~~~~~~~~~~~~~
        RANK 1 LOGO -->
        <a target="_blank" rel="noreferrer" href="">
          <div id='featured-rank' style='margin-bottom: 20px;'>
            <GoldCup imageURL={value.site_data_array[0].image} />
            <!-- 
            Featured Image Details -->
            <p class='x-large'>{value.site_data_array[0].name}</p>
            <p class='large' style='color: #8C8C8C;'>Rank 1</p>
          </div>
        </a>
        <!--
        ~~~~~~~~~~~~~~~
        RANK 3 -->
        <a target="_blank" rel="noreferrer" href="">
          <div id='featured-rank' style='margin-top: 20px;'>
            <BronzeCup imageURL={value.site_data_array[2].image} />
            <!-- 
            Featured Image Details -->
            <p class='x-large'>{value.site_data_array[2].name}</p>
            <p class='large' style='color: #8C8C8C;'>Rank 3</p>
          </div>
        </a>
      </div>
    {/if}
    <!--
    ~~~~~~~~~~~~~~~
    Title-box of the `Feature Site` list 
    -->
    <p id='title-box'>
      {value.title}
    </p>
    <!--
    ~~~~~~~~~~~~~~~
    Display the first 5 rows on Mobile; 
    -->
    {#each value.site_data_array.slice(0, limitViewRow) as item}
        <FeaturedSiteRow data={item} />
    {/each}

    {#if displayShowMore}
      <div>
        <p id='show-more-box' 
          on:click={() => toggleFullList()}>
          {#if !showMore}
            {value.show_more_less[0]}
          {:else} 
            {value.show_more_less[1]}
          {/if}
        </p>
      </div>
    {:else}
      <p id='show-more-box' style="padding: 5px; box-shadow: none;">
      </p>
    {/if}

  </div>

{:catch error}
  {error}
  <!-- 
  promise was rejected -->
{/await}