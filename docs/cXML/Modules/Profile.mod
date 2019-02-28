<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Profile.mod#5 $
-->

<!--
    Request for the latest profile from the server.  May also be used as
    a 'ping' transaction (to check if the server is available).
-->
<!ELEMENT ProfileRequest EMPTY >

<!--
    Static profile response describing the transactions supported by this
    server.  The content should not change frequently.

    effectiveDate
        When these services were first available.  Should not be in the
    future since new clients may need to interact with a server.

    a-dtype
        Datatype enumeration for the attributes of this element.  May be
    ignored by most XML parsers (used for documentation purposes).
-->
<!ELEMENT ProfileResponse ( Option*, Transaction+ )>
<!ATTLIST ProfileResponse
    effectiveDate %datetime.tz; #REQUIRED
    a-dtype       NMTOKENS      #FIXED 'effectiveDate dateTime'
>

<!--
    Value for a defined option (either for the overall service or a
    specific transaction.  At this time, no options are defined at either
    level.

    name
        The name of this option.  Future versions of cXML will define
    values for this attribute.  This is not intended to be viewed
    directly (the profile is intended mostly for machine consumption).

    a-dtype
        Datatype enumeration for the attributes of this element.  May be
    ignored by most XML parsers (used for documentation purposes).
-->
<!ELEMENT Option ( #PCDATA )>   <!-- string -->
<!ATTLIST Option
    name          %string;      #REQUIRED
    a-dtype       NMTOKENS      #FIXED 'name string'
>

<!--
    A transaction supported by this server.

    requestName
        A specific request this server accepts at the given URL.  The
    %cxml.requests entity (defined in transport.mod) contains the
    possible values for this attribute.

    a-dtype
        Datatype enumeration for the attributes of this element.  May be
    ignored by most XML parsers (used for documentation purposes).
-->
<!ELEMENT Transaction ( URL, Option* )>
<!ATTLIST Transaction
    requestName   %nmtoken;     #REQUIRED
    a-dtype       NMTOKENS      #FIXED 'requestName NMTOKEN'
>
