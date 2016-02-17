SRC:=$(shell ls upfa*.tex)
SVG=$(SRC:.tex=.svg)

all: $(SVG)

%.svg: %.tex
	pdflatex $*.tex
	pdf2svg $*.pdf $*.svg
	convert -density 106 $*.pdf $*.png
	rm $*.log $*.aux $*.pdf
