# geomaster

Geospatial science and remote-sensing style workflows.

## When to use
When working with satellite imagery, elevation data, land cover classification, or geospatial analysis that goes beyond standard GIS operations.

## Key tools
- **rasterio**: read/write raster data (GeoTIFF, NetCDF)
- **geopandas**: vector data operations
- **shapely**: geometry operations
- **pyproj**: coordinate reference system transformations
- **earthengine-api**: Google Earth Engine for large-scale remote sensing

## Common operations
```python
import rasterio
import numpy as np

with rasterio.open("landsat.tif") as src:
    red = src.read(4).astype(float)
    nir = src.read(5).astype(float)
    ndvi = (nir - red) / (nir + red + 1e-10)  # NDVI
    print(f"NDVI range: {ndvi.min():.2f} to {ndvi.max():.2f}")
```

## CRS handling
```python
from pyproj import Transformer
transformer = Transformer.from_crs("EPSG:4326", "EPSG:3857")
x, y = transformer.transform(lat, lon)
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
