# geopandas

GIS dataframes, spatial joins, maps, and geometry analysis.

## When to use
When working with vector geospatial data: shapefiles, GeoJSON, spatial joins, or map visualizations in Python.

## Core operations
```python
import geopandas as gpd
from shapely.geometry import Point

# Read spatial data
world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))
cities = gpd.read_file("cities.geojson")

# Spatial join: find which country each city is in
cities_with_country = gpd.sjoin(cities, world, how="left", predicate="within")

# Buffer: 50km radius around each point
cities["geometry"] = cities.geometry.buffer(50000)  # meters (if CRS is projected)

# CRS conversion
world_mercator = world.to_crs(epsg=3857)

# Plot
world.plot(column="pop_est", legend=True, figsize=(12, 6))
```

## File formats
- GeoJSON: `.geojson`
- Shapefile: `.shp` (with `.dbf`, `.prj`)
- GeoPackage: `.gpkg` (preferred for new projects)

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
