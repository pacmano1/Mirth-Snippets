// Just an example of how to create a java thingy that evaluates on poll.  In this case it returns yesterday in yyyyMMdd.

function createDateRetriever() {
    function getYesterday() {
        var DateTime = Packages.org.joda.time.DateTime;
        var DateTimeFormat = Packages.org.joda.time.format.DateTimeFormat;
        var yesterday = new DateTime().minusDays(1);
        var dateFormat = DateTimeFormat.forPattern("yyyyMMdd");
        var formattedDate = yesterday.toString(dateFormat);
        return String(formattedDate);
    }
    return new JavaAdapter(java.lang.Object, {
        getYesterday: getYesterday
    });
}

$gc('DateRetriever', createDateRetriever())

// In Source File Filter:
// ${DateRetriever.getYesterday()}.xml  // or whatever

return;
