<?xml version="1.0" encoding="UTF-8"?>
<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Common.mod#16 $
-->

<!--
    A few character entities the XML recommendation says should be defined
    "for interoperability" with existing SGML parsers.  By default, these
    are not included to avoid warnings (about entity redefinition) from
    many XML parsers.
-->
<!ENTITY % SGML-help "IGNORE">
<![%SGML-help;[
<!ENTITY lt     "&#38;#60;">
<!ENTITY gt     "&#62;">
<!ENTITY amp    "&#38;#38;">
<!ENTITY apos   "&#39;">
<!ENTITY quot   "&#34;">
]]>

<!--
    Common types used throughout the cXML definition.

    The types try to follow the XML DATA definition submitted to the W3C. See
    the following for more information,

        http://msdn.microsoft.com/xml/reference/schema/datatypes.asp
        http://www.w3c.org/TR/1998/NOTE-XML-data-0105/

-->

<!-- Atomic-level Types -->
<!ENTITY % bin.base64 "CDATA">
<!ENTITY % bin.hex "CDATA">
<!ENTITY % boolean "(0 | 1)">    <!-- 0 is false, 1 is true -->
<!ENTITY % char "CDATA">
<!ENTITY % date "CDATA">
<!ENTITY % datetime.tz "CDATA">  <!-- Time zone is required -->
<!ENTITY % fixed.14.4 "CDATA">
<!ENTITY % i8 "CDATA">
<!ENTITY % int "%i8;">
<!ENTITY % r8 "CDATA">
<!ENTITY % number "CDATA">       <!-- No limit on number of digits, unlike
                                      %r8; -->
<!ENTITY % string "CDATA">
<!ENTITY % time.tz "CDATA">      <!-- Time zone is required -->
<!ENTITY % ui8 "CDATA">
<!ENTITY % uint "%ui8;">         <!-- Unique to this specification -->
<!ENTITY % uri "CDATA">
<!ENTITY % uuid "CDATA">

<!-- Higher-level Types -->
<!--
    NOTE: The following is a temporary *hack* to allow empty values for
    some attributes with these types.  The nmtoken entity should resolve to
    NMTOKEN.
-->
<!ENTITY % nmtoken "CDATA">      <!-- Any combination of XML name chars. -->
<!ENTITY % isoLangCode "%nmtoken;">         <!-- ISO 639 Language Code -->
<!ENTITY % isoCountryCode "%nmtoken;">      <!-- ISO 3166 Country Code -->
<!ENTITY % isoCurrencyCode "%nmtoken;">     <!-- ISO 4217 Currency Code -->
<!ENTITY % xmlLangCode "%nmtoken;"> <!-- Language code as defined by XML
                                         recommendation: Language and
					 country. -->
<!ENTITY % URL "%uri;">
