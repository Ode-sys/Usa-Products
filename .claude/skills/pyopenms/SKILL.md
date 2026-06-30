# pyopenms

Mass spectrometry and proteomics data analysis workflows.

## When to use
When analyzing mass spectrometry data for proteomics, metabolomics, or small molecule identification.

## Core operations
```python
import pyopenms

# Load mzML file
exp = pyopenms.MSExperiment()
pyopenms.MzMLFile().load("data.mzML", exp)

# Iterate spectra
for spectrum in exp:
    if spectrum.getMSLevel() == 1:
        mz, intensity = spectrum.get_peaks()
        print(f"RT: {spectrum.getRT():.2f}, peaks: {len(mz)}")
```

## Peptide identification workflow
1. Load mzML data
2. Peak picking: `pyopenms.PeakPickerHiRes()`
3. Feature detection: `pyopenms.FeatureFinderAlgorithmPicked()`
4. Database search: connect to Mascot, X!Tandem, or use OpenMS tools
5. FDR filtering: `pyopenms.FalseDiscoveryRate()`

## Common file formats
- `.mzML` — standard MS data
- `.mzXML` — legacy MS data
- `.idXML` — OpenMS identification format
- `.featureXML` — quantification features

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
