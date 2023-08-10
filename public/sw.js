const addResourcesToCache = async resources => {
  const cache = await caches.open("v1")
  await cache.addAll(resources)
}

const putInCache = async (request, response) => {
  const cache = await caches.open("v1")
  await cache.put(request, response)
}

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request)
  if (responseFromCache) {
    return responseFromCache
  }

  // Next try to use (and cache) the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise
  if (preloadResponse) {
    console.info("using preload response", preloadResponse)
    putInCache(request, preloadResponse.clone())
    return preloadResponse
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request)
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone())
    return responseFromNetwork
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl)
    if (fallbackResponse) {
      return fallbackResponse
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    })
  }
}

// Enable navigation preload
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable()
  }
}

self.addEventListener("activate", event => {
  event.waitUntil(enableNavigationPreload())
})

self.addEventListener("install", event => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/IRANSans.woff2",
      "/app.js",
      "/image-list.js",
      "/star-wars-logo.jpg",
      "/gallery/bountyHunters.jpg",
      "/gallery/myLittleVader.jpg",
      "/gallery/snowTroopers.jpg",
      "https://snappfood.ir/static/images/placeholder.png",
      "https://cdn.snappfood.ir/pwa/assets/fonts/woff2/IRANSansWeb_Bold.woff2",
      "https://snappfood.ir/static/images/img_app_mockup@2x.png",
      "https://snappfood.ir/static/images/senf.png",
      "https://snappfood.ir/static/images/hero-image.png",
      "https://i.postimg.cc/vmpWHbmJ/vendor-img-big.png",
      "https://snappfood.ir/static/images/vendor_pic.png",
      "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/634bff2c452e0.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_1_603508bf202d8_img_st_food.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_3_603508a95b9be_img_st_sweet.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_4_603508a14ab73_img_st_supermarket.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_6_6035088cbcde4_img_st_fruit.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_2_603508b330711_img_st_cafe.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_8_6035087b463a3_img_st_icecream.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_7_60350883d6e43_img_st_nut.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_11_603507afc9a32_img_st_meat.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_5_60350898c61b5_img_st_bakery.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_9_603b811b1d540_img_st_other2.png",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_irani_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_fastfood_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_kebab_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_pizza_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_burger_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_sandwich_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_sokhari_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_italy_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_salad_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_seafood_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_asian_1.jpg",
      ,
      "https://cdn.snappfood.ir/uploads/images/tags/website_image_gilani_1.jpg",
    ]),
  )
})

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const networkFetch = fetch(event.request)
        .then(response => {
          // update the cache with a clone of the network response
          const responseClone = response.clone()
          caches.open(url.searchParams.get("name")).then(cache => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(function (reason) {
          console.error("ServiceWorker fetch failed: ", reason)
        })
      // prioritize cached response over network
      return cachedResponse || networkFetch
    }),
  )
})
