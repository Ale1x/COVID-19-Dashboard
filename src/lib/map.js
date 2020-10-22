export function promiseToFlyTo( map, { zoom, center }) {
  return new Promise(( resolve, reject ) => {
    const baseError = 'Non riesco ad andare sopra!';

    if ( !map.flyTo ) {
      reject( `${baseError}: metodo no flyTo sulla mappa` );
    }

    if ( typeof zoom !== 'number' ) {
      reject( `${baseError}: Numero zoom invalido ${zoom}` );
    }

    const mapCenter = center || map.getCenter();
    const mapZoom = zoom || map.getZoom();

    map.flyTo( mapCenter, mapZoom, {
      duration: 2
    });

    map.once( 'moveend', () => {
      resolve();
    });
  });
}

export function getCurrentLocation() {
  return new Promise(( resolve, reject ) => {
    navigator.geolocation.getCurrentPosition(
      ( pos ) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ( err ) => reject( err )
    );
  });
}
