# latex-posters

Create academic poster layouts and conference-style outputs.

## When to use
When a researcher needs a scientific conference poster in PDF format.

## Standard sizes
- A0 portrait: 841 × 1189 mm (most common)
- A1 portrait: 594 × 841 mm
- 36×48 inches (US conferences)

## LaTeX template (beamerposter)
```latex
\documentclass[final]{beamer}
\usepackage[scale=1.24]{beamerposter}
\usetheme{confposter}

\begin{document}
\begin{frame}
  \begin{columns}
    \begin{column}{0.32\textwidth}
      \begin{block}{Introduction} ... \end{block}
      \begin{block}{Methods} ... \end{block}
    \end{column}
    \begin{column}{0.32\textwidth}
      \begin{block}{Results} ... \end{block}
    \end{column}
    \begin{column}{0.32\textwidth}
      \begin{block}{Conclusions} ... \end{block}
    \end{column}
  \end{columns}
\end{frame}
\end{document}
```

## Layout guide
- 3 columns for wide posters, 2 for narrow.
- Figures > text. Use large font (minimum 24pt body).

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
