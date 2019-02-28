<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Pending.mod#7 $
-->

<!--
    For better definitions of these Elements/Entities, refer to the cXML
    Specification documents.
-->

<!--
    A request used for polling for waiting messages. A waiting message, if
    any, will be included in the returned stream. The lastReceivedTimestamp
    attribute, if present, provides the timestamp of the last received
    message. When the Receiver sees this, it can remove messages with earlier
    timestamps from the pending queue.

    The maxMessages attribute is used to indicate the maximum number of
    pending messages that can be included in the response.


-->
<!ELEMENT GetPendingRequest (MessageType+)>
<!ATTLIST GetPendingRequest
    maxMessages            %uint;         #IMPLIED
    lastReceivedTimestamp  %datetime.tz;  #IMPLIED
>

<!--
    Indicates the type of message(s) being polled for. The valid values are
    the corresponding element names e.g. SubscriptionChangeMessage.
-->
<!ELEMENT MessageType (#PCDATA)> <!-- nmtoken -->


<!--
    The data elements being carried back in the response. These are fully
    formed cXML messages being carried through the Request/Response channel.
-->
<!ELEMENT GetPendingResponse (cXML+)>
