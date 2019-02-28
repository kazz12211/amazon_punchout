<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Transport.mod#36 $
-->

<!--
    For better definitions of these Elements/Entities, refer to the cXML
    Protocol Specification documents.
-->

<!--
    cXML envelope

    version
        Version of this cXML transmission.  Should be less than or equal
    to the version portion of the SYSTEM identifier for this document.

    payloadID
        A unique identifier for this document.

    timestamp
        The date and time at which this document was originally created.

    xml:lang
        The default locale for all strings (not formatted items such as
    dates, times and numbers) in this document.  This attribute will be
    required in a future version of cXML.  (Leaving it out is
    deprecated.)
-->
<!ELEMENT cXML (( Header, (Message | Request)) | Response)>
<!ATTLIST cXML
    version    %string;       "&cxml.version;"
    payloadID  %string;       #REQUIRED
    timestamp  %datetime.tz;  #REQUIRED
    xml:lang   %xmlLangCode;  #IMPLIED
>

<!-- header -->
<!ELEMENT Header (From, To, Sender)>

<!ELEMENT From (Credential+)>
<!ELEMENT To (Credential+)>
<!ELEMENT Sender (Credential+, UserAgent)>

<!--
    A textual string representing who the UserAgent is conducting the cXML
    conversation. Analogous to UserAgent for HTTP conversations.
-->
<!ELEMENT UserAgent (#PCDATA)>

<!--
    A digital signature.  The recommended format is self-contained PK7. The
    exact signed content is not that significant but current timestamp would
    be used just as a convention.

    type
        The type of digital signature used.

    encoding
        How is the signature encoded in the XML stream.
-->
<!ELEMENT DigitalSignature ANY>
<!ATTLIST DigitalSignature
    type      %string;  "PK7 self-contained"
    encoding  %string;  "Base64"
>

<!--
    A shared secret. Typically, this is a username/password type of secret
    exchanged through a secure transport before communication takes place.
-->
<!ELEMENT SharedSecret ANY>

<!--
    Represents an identity for a credential.

    lastChangedTimestamp
       When the underlying object last changed in the originating system.
       This is used in cases where the same object (e.g. a buyer
       organization) is replicated, and kept synchronized, across two
       systems.
-->
<!ELEMENT Identity ANY>
<!ATTLIST Identity
    lastChangedTimestamp  %datetime.tz;  #IMPLIED
>

<!--
    A combination of an Identity and authentication element. If the
    authentication element is present, it strongly authenticates who/what
    someone is.  The authentication element should not be sent within Message
    documents transported via an end user's browser.  One-way communication
    must be authenticated in the transport layer.

    domain
        In what domain is this Credential represented?
    type
        Does this Credential identify a marketplace or one of its member
        companies?  A Credential without this attribute describes a member
        company or unaffiliated buying organization.
-->
<!ENTITY % cxml.authentication  "SharedSecret |
                                 DigitalSignature"
>
<!ELEMENT Credential (Identity, (%cxml.authentication;)?)>
<!ATTLIST Credential
    domain  %string;      #REQUIRED
    type    (marketplace) #IMPLIED
>

<!--
    Status of a Response or Message.  If present, the element content
    describes specifics of a problem.

    code
        HTTP or cXML-specific status code.

    text
        Textual version of the status code (not specific issue).

    xml:lang
        The language in which the text attribute and element content are
    written.  This attribute will be required in a future version of
    cXML.  (Leaving it out is deprecated.)
-->
<!ELEMENT Status (#PCDATA)>
<!ATTLIST Status
    code     %uint;        #REQUIRED
    text     %string;      #REQUIRED
    xml:lang %xmlLangCode; #IMPLIED
>

<!--
    Message

    When Status not present, '<Status code="200" text="OK" />' is implied.
-->
<!ELEMENT Message (Status?, %cxml.messages;)>
<!ATTLIST Message
    deploymentMode  (production | test)  "production"
    inReplyTo       %string;  #IMPLIED
>

<!-- request -->
<!ELEMENT Request (%cxml.requests;)>
<!ATTLIST Request
    deploymentMode  (production | test)  "production"
>

<!-- response -->
<!ELEMENT Response (Status, (%cxml.responses;)?)>
