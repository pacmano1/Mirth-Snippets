// dforesman on the Mirth forums came up with this, posting here for reference.
// https://forums.mirthproject.io/forum/mirth-connect/support/18564-merge-pdfs?p=102171#post102171
//merge examples
//https://www.programcreek.com/java-api-examples/?api=org.apache.pdfbox.util.PDFMergerUtility
//https://stackoverflow.com/questions/13808090/create-pdf-and-merge-with-pdfbox

//byte array
//http://www.mirthproject.org/community/forums/showthread.php?p=253236
//http://www.mirthcorp.com/community/forums/showthread.php?t=3909

//existing file
var pdf1 = FileUtil.readBytes('C:/Users/Media/Desktop/PDF testing/old/testing_large.pdf');
//file to be merged
var pdf2 = FileUtil.readBytes('C:/Users/Media/Desktop/PDF testing/old/Psychiatric SOAP Note Example.pdf');
var merger = new org.apache.pdfbox.util.PDFMergerUtility();
   merger.addSource(new java.io.ByteArrayInputStream(pdf1));
   merger.addSource(new java.io.ByteArrayInputStream(pdf2));
   // do the rest with the merger
//destination
var bout2 = new java.io.BufferedOutputStream(new java.io.FileOutputStream('C:/Users/Media/Desktop/PDF testing/old/MM2_pdf_dummy.pdf'));
//magic
            merger.setDestinationStream(bout2);
            merger.mergeDocuments();
