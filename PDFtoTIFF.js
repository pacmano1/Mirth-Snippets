// Copyright (c) [2024] [Diridium Technologies Inc.  https://diridium.com]
// 
// converts mulitpage pdf to tif file per page

var PDFRenderer = Packages.org.apache.pdfbox.rendering.PDFRenderer;
var PDDocument = Packages.org.apache.pdfbox.pdmodel.PDDocument;
var BufferedImage = Packages.java.awt.image.BufferedImage;
var ImageIO = Packages.javax.imageio.ImageIO;
var File = Packages.java.io.File;

// Function to convert PDF to TIF
function convertPdfToTif(pdfPath, outputDir) {
    var document = PDDocument.load(new File(pdfPath));
    var renderer = new PDFRenderer(document);
    var pageCount = document.getNumberOfPages();

    for (var i = 0; i < pageCount; i++) {
        var image = renderer.renderImageWithDPI(i, 150); // Render the PDF page at 300 DPI
        var outputFile = new File(outputDir + '/page-' + (i + 1) + '.tif');
        ImageIO.write(image, 'TIFF', outputFile);
    }
    document.close();
}

// Call the function with appropriate file paths
var pdfPath = '/tmp/mac.pdf';
var outputDir = '/tmp';
convertPdfToTif(pdfPath, outputDir);
