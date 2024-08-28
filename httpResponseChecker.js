try {
    msg = JSON.parse(msg)             // we are going to reset msg to be its value in JSON here.
    $co('isJSONresponse', true)
} catch (e) {                         // we have an empty msg or some other non-JSON response 
    $co('isJSONresponse', false)
}

var responseStatusLine = $('responseStatusLine');
var responseCode = parseInt(responseStatusLine.split(' ')[1], 10);

if ( responseCode == 200) {    // we have an entirely successful message (note no check on isJSON, buyer beware)
        $co('API_Post_OK',true)
        process_results();
} else {                                    // we either have an entirely bad post (endpoint not answering OR we have a JSON error)
    if ($co('isJSONresponse') == true) {     // do not retry, just collect the JSON stuff
        responseStatus = SENT
        bad_call_error_handler(JSON.stringify(msg))
    } else {                                    // Let's retry a few times
        if (connectorMessage.getSendAttempts() <= 2) { // try a few times
            responseStatus = QUEUED                 // 
        } else {                                // exceeded the tries
              responseStatus = SENT
              $co('API_Post_OK',false)
              bad_call_error_handler(msg)                    // we have tried this post a few times, responseStatus will already be ERROR, so just send the alert
        }
    }
}
