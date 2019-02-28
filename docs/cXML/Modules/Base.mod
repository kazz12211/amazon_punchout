<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Base.mod#27 $
-->

<!--
    This file defines the basic elements used to build higher level
    constructs in cXML.
-->

<!-- Basic Name/Data Elements -->
<!--
    Name is used to provide an identifier for other elements.

    xml:lang
        The language in which the name is written.
-->
<!ELEMENT Name (#PCDATA)> <!-- string -->
<!ATTLIST Name
    xml:lang  %xmlLangCode;  #REQUIRED
>

<!--
    An Extrinsic is an element which can be used to extend the data
    associated with known elements.

    Since this Element is of type ANY, it could contain any arbitrary XML
    document within itself, or a binary ![CDATA[]] document.

    name
        Name used to identify this extrinsic.
-->
<!ELEMENT Extrinsic ANY>
<!ATTLIST Extrinsic
    name  %string;  #REQUIRED
>

<!--
    Description is a string which describes something.
    Though text may be interspersed with ShortName elements in this content
    model, placing the ShortName at the beginning or end of the element is
    much preferred.  At most one ShortName element is allowed per
    Description.  The intended content model would be more like
    (( ShortName, #PCDATA ) | ( #PCDATA | ShortName? )) if DTD syntax
    supported it.

    xml:lang
        The language in which the description is written.
-->
<!ELEMENT Description ( #PCDATA | ShortName )* > <!-- mixed: string and
                                                      ShortName -->
<!ATTLIST Description
    xml:lang  %xmlLangCode;  #REQUIRED
>

<!--
    A short string which describes something in fewer characters than the
    entire Description.  This should be used when limited space is available.
    For example, a table of elements might show the ShortName's of each.  A
    linked "details" view would show the entire Description (including the
    ShortName).  Without a ShortName, the user interface must default to a
    truncation of the Description.
    This element does not require an xml:lang attribute since it appears only
    within a Description element.  The language of the ShortName must match
    that of the surrounding Description.
-->
<!ELEMENT ShortName (#PCDATA)> <!-- string -->

<!-- Telephone Number Elements -->
<!--
    International ITU dial code for the country code in question.  This
    code would be entered after any escape code necessary to begin
    International dialing.  That is, the escape code does not appear in the
    content of this element.

    isoCountryCode
        The ISO 3166 2-letter country code for the dial code in question.
-->
<!ELEMENT CountryCode (#PCDATA)> <!-- uint -->
<!ATTLIST CountryCode
    isoCountryCode  %isoCountryCode;  #REQUIRED
>

<!--
    The areacode or city code within a CountryCode.
-->
<!ELEMENT AreaOrCityCode (#PCDATA)> <!-- uint -->

<!--
    The local number part of a telephone number.
-->
<!ELEMENT Number (#PCDATA)> <!-- string -->

<!--
    An extension within relative to the Number element. This element has no
    meaning without an associated Number element.
-->
<!ELEMENT Extension (#PCDATA)> <!-- uint -->

<!--
    TelephoneNumber represents international telephone numbers.
-->
<!ELEMENT TelephoneNumber (CountryCode, AreaOrCityCode, Number, Extension?)>

<!--
     Phone is a "named" TelephoneNumber.

     name
          specifies an identifier which indicates the type of phone number.
          US examples would include "work","home", etc.
-->
<!ELEMENT Phone (TelephoneNumber)>
<!ATTLIST Phone
    name  %string;  #IMPLIED
>

<!--
    Fax number.
-->
<!ELEMENT Fax (TelephoneNumber | URL | Email)>
<!ATTLIST Fax
    name  %string;  #IMPLIED
>

<!-- Addressing Elements -->
<!--
    URL. A string which represents a URL
-->
<!ELEMENT URL (#PCDATA)> <!-- URL -->
<!ATTLIST URL
    name  %string;  #IMPLIED
>

<!--
    An email address. Address must conform to RFC 821 (SMTP Standard).
-->
<!ELEMENT Email (#PCDATA)> <!-- string -->
<!ATTLIST Email
    name  %string;  #IMPLIED
>

<!--
    Contact represents an entity at a location. The nature of this
    element is that it represents a communication "end point" for a
    location.

    role
        Position this person or group plays in the procurement process.
        Likely values include endUser, administrator, purchasingAgent,
           technicalSupport, customerService, sales,
           supplierMasterAccount, supplierAccount, buyerMasterAccount,
           and buyerAccount.  Other values may be allowed in some cases.
-->
<!ELEMENT Contact (Name, PostalAddress*, Email*, Phone*, Fax*, URL*)>
<!ATTLIST Contact
    role NMTOKEN #IMPLIED
>

<!--
    The DeliverTo part of an Address. This would be internal to the actual
    address know to the outside world. Similar to what an extension is to a
    TelephoneNumber.
-->
<!ELEMENT DeliverTo (#PCDATA)> <!-- string -->

<!--
    Street is a single line of an Address' location.
-->
<!ELEMENT Street (#PCDATA)> <!-- string -->

<!--
    City is the name of the city in an Address' location.
-->
<!ELEMENT City (#PCDATA)> <!-- string -->

<!--
    State is an optional state identifier in an Address' location.
-->
<!ELEMENT State (#PCDATA)> <!-- string -->

<!--
    PostalCode (I have no idea how to describe it)
-->
<!ELEMENT PostalCode (#PCDATA)> <!-- string -->

<!--
    Country is the name of the country in an Address' location.  The
    content of this element is a string which may (for example) be printed
    directly to a shipping label.  The content is the human-readable
    equivalent of the isoCountryCode used by applications.

    isoCountryCode
        The ISO 3166 2-letter country code for this country.
-->
<!ELEMENT Country (#PCDATA)> <!-- string -->
<!ATTLIST Country
    isoCountryCode  %isoCountryCode;  #REQUIRED
>

<!--
    PostalAddress is a real-world location for a business or person.
-->
<!ELEMENT PostalAddress (DeliverTo*, Street+, City, State?,
                         PostalCode?, Country)>
<!ATTLIST PostalAddress
    name  %string;  #IMPLIED
>

<!--
    Address is the association of a Contact and an Location.

    isoCountryCode
        The ISO 3166 2-letter country code for the country containing this
        location.

    addressID
        An id for the address.  Needed to support address codes for
        relationships that require id references.  An example would be a
        shipping code.
-->
<!ELEMENT Address (Name, PostalAddress?, Email?, Phone?, Fax?, URL?)>
<!ATTLIST Address
    isoCountryCode  %isoCountryCode;  #IMPLIED
    addressID       %string;          #IMPLIED
>

<!-- Financial Elements -->
<!--
    Money is the representation of the object used to pay for items.

    currency
        specifies the currency in which amount is stated, must conform to ISO
        4217 currency codes.

    alternateAmount
        the amount of money in the alternateCurrency. Optional and used to
        support dual-currency requirements such as the Euro.

    alternateCurrency
        specifies the currency in which the alternateAmount is stated, must
        conform to ISO 4217 currency codes.
-->
<!ELEMENT Money (#PCDATA)> <!-- number -->
<!ATTLIST Money
    currency           %isoCurrencyCode;  #REQUIRED
    alternateAmount    %number;           #IMPLIED
    alternateCurrency  %isoCurrencyCode;  #IMPLIED
>

<!--
    Optional textual child for communicating arbitrary comments or
    description along with the parent.
    Though text may be interspersed with Attachment elements in this content
    model, grouping the Attachment list at the begging or end of the element
    is much preferred.  The intended content model would be more like
    (( Attachment+, #PCDATA ) | ( #PCDATA | Attachment* )) if the DTD syntax
    supported it.

    xml:lang
        The language in which the Comments are written.  This attribute
    will be required in a future version of cXML.  (Leaving it out is
    deprecated.)
-->
<!ELEMENT Comments ( #PCDATA | Attachment )* > <!-- mixed: string and
                                                    opt. Attachment list -->
<!ATTLIST Comments
    xml:lang  %xmlLangCode;  #IMPLIED
>

<!--
    Optional child of Comments element referencing a part in a multipart MIME
    transmission.

    The contained URL must use the scheme "cid:".  This is the identifier for
    the referenced attachment within the larger transmission.  Must match the
    Content-ID header of one (and only one) part of the MIME transmission
    containing this cXML document.  May also be used to retrieve the
    attachment file separately.
-->
<!ELEMENT Attachment (URL)>

<!--
    Price per unit of item.
-->
<!ELEMENT UnitPrice (Money)>

<!--
    Reference to an earlier document (for example, OrderRequest).  In a
    StatusUpdateRequest, this element identifies the purchase order to be
    updated.

    payloadID
        A unique identifier for the document.  Copied directly from the
        cXML element of the original document.
-->
<!ELEMENT DocumentReference EMPTY>
<!ATTLIST DocumentReference
    payloadID       %string;      #REQUIRED
>
