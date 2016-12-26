# Reference

## Location Services

Build real-world apps with our built in location support!

Use the [Schema Designer](https://scaphold.io/apps) to add a field with type Location

<img src="images/news/location-field.png" alt="Add a Location field.">

Scaphold detect's your Location fields and adds geographic queries automatically. Go to the doc explorer in GraphiQL and open the Viewer query field type to see the new functionality!

### Create objects with locations

<pre class="left">
// Query
mutation CreateArtist($input:_CreateArtistInput!) {
  createArtist(input: $input) {
    changedArtist {
      id
      name
      location {
        lat
        lon
      }
    }
  }
}

// Variables
{
    "input": {
        "location": {
            "lat": 47.606209,
            "lon": -122.332071
        },
        "name": "Macklemore"
    }
}
</pre>

### Query objects nearest to a location

<pre class="left">
# Get the artists nearest Seattle
query ClosestArtistsToSeattle($loc: _GeoLocationInput!, $unit: _GeoUnit) {
  viewer {
    getNearestArtistsByLocation(location: $loc, maxResults: 30, maxDist: 100, unit: $unit) {
      dist
      node {
        id
        name
        location {
          lat
          lon
        }
      }
    }
  }
}

// Variables
{
    "loc": {
        "lat": 47.644826,
        "lon": -122.334480
    },
    "unit": "mi"
}
</pre>

### Query all objects within a geographic circle

<pre class="left">
# Get the artists within 1000 meters of Golden Gate Park
query ArtistsWithinGoldenGatePark($circle: _GeoCircleInput!) {
  viewer {
    getUsersInsideCircleByLocation(circle: $circle) {
      id
      name
      location {
          lat
          lon
      }
    }
  }
}

// Variables
{
    "circle": {
        "center": {
            "lat": 37.769040,
            "lon": -122.483519
        },
        "radius": 1000,
        "unit": "m"
    }
}
</pre>

### Query all objects within an arbitrary geograhic area

<pre class="left">
# Get all artists from NY to Chicago to DC
query ArtistsFromNYToChicagoToDC($area: _GeoAreaInput!) {
  viewer {
    getUsersInsideAreaByLocation(area: $area) {
      id
      name
      location {
          lat
          lon
      }
    }
  }
}

// Variables
{
    "area": {
        "points": [
            {
                "lat": 40.712784,
                "lon": -74.005941
            },
            {
                "lat": 41.878114,
                "lon": -87.629798
            },
            {
                "lat": 38.907192,
                "lon": -77.036871
            }
        ]
    }
}
</pre>
