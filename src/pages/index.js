import React from 'react';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import { useTracker } from 'hooks';
import { Layout, Map } from 'components';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

const IndexPage = () => {
  const { data: stats = {} } = useTracker({
    api: 'all'
  });

  const { data: countries = [] } = useTracker({
    api: 'countries'
  });

  const hasCountries = Array.isArray( countries ) && countries.length > 0;

  const dashboardStats = [
    {
      primary: {
        label: 'Casi totali',
        value: stats ? stats?.cases.toLocaleString( 'it-IT' ) : '-'
      },
      secondary: {
        label: '/ Milione',
        value: stats ? stats?.casesPerOneMillion.toLocaleString( 'it-IT' ) : '-'
      }
    },
    {
      primary: {
        label: 'Morti totali',
        value: stats ? stats?.deaths.toLocaleString( 'it-IT' ) : '-'
      },
      secondary: {
        label: '/ Milione',
        value: stats ? stats?.deathsPerOneMillion.toLocaleString( 'it-IT' ) : '-'
      }
    },
    {
      primary: {
        label: 'Tamponi totali',
        value: stats ? stats?.tests.toLocaleString( 'it-IT' ) : '-'
      },
      secondary: {
        label: '/ Milione',
        value: stats ? stats?.testsPerOneMillion.toLocaleString( 'it-IT' ) : '-'
      }
    },
    {
      primary: {
        label: 'Casi Attivi',
        value: stats ? stats?.active.toLocaleString( 'it-IT' ) : '-'
      }
      // secondary: {
      //     label: 'Per 1 Million',
      //     value: stats ? stats?.activePerOneMillion.toLocaleString( 'it-IT' ) : '-',
      // },
    },
    {
      primary: {
        label: 'Casi critici',
        value: stats ? stats?.critical.toLocaleString( 'it-IT' ) : '-'
      }
      // secondary: {
      //     label: 'Per 1 Million',
      //     value: stats ? stats?.criticalPerOneMillion.toLocaleString( 'it-IT' ) : '-',
      // },
    },
    {
      primary: {
        label: 'Casi ricoverati',
        value: stats ? stats?.recovered.toLocaleString( 'it-IT' ) : '-'
      }
      // secondary: {
      //     label: 'Per 1 Million',
      //     value: stats ? stats?.recoveredPerOneMillion.toLocaleString( 'it-IT' ) : '-',
      // },
    }
  ];

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    if ( !hasCountries || !map ) return;

    map.eachLayer(( layer ) => {
      if ( layer?.options?.name === 'Mapbox' ) return;
      map.removeLayer( layer );
    });

    const geoJson = {
      type: 'FeatureCollection',
      features: countries.map(( country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        };
      })
    };

    const geoJsonLayers = new L.GeoJSON( geoJson, {
      pointToLayer: ( feature = {}, latlng ) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const { country, updated, cases, deaths, recovered } = properties;

        casesString = `${cases}`;

        if ( cases > 1000000 ) {
          casesString = `${casesString.slice( 0, -6 )}M+`;
        } else if ( cases > 1000 ) {
          casesString = `${casesString.slice( 0, -3 )}K+`;
        }
        if ( updated ) {
          updatedFormatted = new Date( updated ).toLocaleString();
        }

        const html = `
                    <span class="icon-marker">
                        <span class="icon-marker-tooltip">
                        <h2>${country}</h2>
                        <ul>
                            <li><strong>Confermati:</strong> ${cases.toLocaleString( 'it-IT' )}</li>
                            <li><strong>Morti:</strong> ${deaths.toLocaleString( 'it-IT' )}</li>
                            <li><strong>Ricoverati:</strong> ${recovered.toLocaleString( 'it-IT' )}</li>
                            <!-- <li><strong>Ultimo aggiornamento:</strong> ${updatedFormatted}</li> -->
                        </ul>
                        </span>
                        ${casesString}
                    </span>
                    `;

        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });

    geoJsonLayers.addTo( map );
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'Mapbox',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Mappa COVID-19</title>
      </Helmet>

      <div className="tracker">
        <Map {...mapSettings} />
        <div className="tracker-stats">
          <ul>
            { dashboardStats.map(({ primary = {}, secondary = {} }, i ) => {
              return (
                <li key={`Stat-${i}`} className="tracker-stat">
                  { primary.value && (
                    <p className="tracker-stat-primary">
                      { primary.value }
                      <strong>{ primary.label }</strong>
                    </p>
                  ) }
                  { secondary.value && (
                    <p className="tracker-stat-secondary">
                      { secondary.value }
                      <strong>{ secondary.label }</strong>
                    </p>
                  ) }
                </li>
              );
            }) }
          </ul>
        </div>
        <div className="tracker-last-updated">
          <p>Ultimo Aggiornamento { stats ? new Date( stats?.updated ).toLocaleString( 'it-IT' ) : '-' }</p>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
