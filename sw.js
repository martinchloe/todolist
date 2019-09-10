// CECI EST MON SERVICE WORKER //

const staticAssets = ["index.html", 'temp.html'];

/* INSTALLATION */
self.addEventListener("install", ev => {
  console.log("service worker installed !");

  //CASHING RESSOURCES STATIQUES
  ev.waitUntil(
    caches.open("static_V1").then(cache => {
      cache.addAll(staticAssets);
      console.log("ressources mise en cache");
    })
  );
});

/* ACTIVATION */
self.addEventListener("activate", ev => {
  console.log("Service worker activé");
});

/* FETCH */
self.addEventListener("fetch", ev => {
  console.log("Fetch Request: ", ev.request);
  ev.respondWith(
    //dans le cache est ce qu'il y a un chemin correspondant à l'url de la requête
    caches.match(ev.request).then(result => {
        return (
          //si oui envoi du résultat
          result || 
          //fetch prend en argument le chemin de la ressource que l'on veux récupérer et retourne une promesse contenant une réponse
          fetch(ev.request).catch(
          () => {
            //si la réponse contient un .png retourne l'image du cache correspond à cette route
          if (ev.request.url.indexOf(".html") > -1) return caches.match('temp.html');
          })
        )
    })
  );
});
