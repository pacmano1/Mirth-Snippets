var pdf1 = new java.lang.String( 'JVBER.....') // replace the value in quotes
var pdf2 = new java.lang.String( 'JVBER.....') // replace the value in quotes
pdf1 = java.util.Base64.getDecoder().decode(pdf1.getBytes("UTF-8"));  
pdf2 = java.util.Base64.getDecoder().decode(pdf2.getBytes("UTF-8"));
var merger = new org.apache.pdfbox.multipdf.PDFMergerUtility(); 
merger.addSource(new java.io.ByteArrayInputStream(pdf1));
merger.addSource(new java.io.ByteArrayInputStream(pdf2));
var bout2 = new java.io.BufferedOutputStream(new java.io.FileOutputStream('/tmp/merged.pdf'));
merger.setDestinationStream(bout2);
merger.mergeDocuments();
