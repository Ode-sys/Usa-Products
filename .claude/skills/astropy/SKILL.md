# astropy

Astronomy and astrophysics data handling, units, tables, and coordinates.

## When to use
When working with astronomical data: FITS files, coordinate transformations, photometry, spectroscopy, or time series.

## Core features
```python
from astropy.io import fits
from astropy.coordinates import SkyCoord
from astropy import units as u
from astropy.table import Table
from astropy.time import Time

# Read FITS
hdul = fits.open("image.fits")
data = hdul[0].data

# Sky coordinates
coord = SkyCoord(ra=83.82*u.degree, dec=-5.39*u.degree, frame="icrs")
coord.galactic  # convert to galactic coordinates

# Units
distance = 1.5 * u.au
distance.to(u.parsec)

# Time
t = Time("2026-01-01T00:00:00", format="isot", scale="utc")
t.mjd  # Modified Julian Date
```

## FITS table
```python
table = Table.read("catalog.fits")
table["RA", "DEC", "FLUX"]
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
