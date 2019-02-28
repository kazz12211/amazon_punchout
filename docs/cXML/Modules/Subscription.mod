<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/subscription.mod#10 $
-->

<!--
    Indicates that something changed in a buyer's content subscription.
    Since this is a Message, it can come at any time - no explicit Request
    needs to be sent first.
-->
<!ELEMENT SubscriptionChangeMessage (Subscription+)>
<!ATTLIST SubscriptionChangeMessage
    type  (new | update | delete)  #REQUIRED
>

<!--
    A content subscription.
-->
<!ELEMENT Subscription (InternalID, Name, Changetime, SupplierID+, Format?,
                        Description?)>

<!ELEMENT InternalID (#PCDATA)> <!-- string -->
<!ATTLIST InternalID
    domain   %string;  #IMPLIED
>

<!ELEMENT Changetime (#PCDATA)> <!-- datetime.tz -->
<!ELEMENT Format (#PCDATA)> <!-- string -->
<!ATTLIST Format
    version  %string;  #REQUIRED
>

<!--
    Requests a complete list of catalog subscriptions for a buyer.
-->
<!ELEMENT SubscriptionListRequest EMPTY>

<!--
    The list of Subscriptions for the given buyer.
-->
<!ELEMENT SubscriptionListResponse (Subscription+)>

<!--
    Requests the contents of a catalog that the buyer is subscribed to.
-->
<!ELEMENT SubscriptionContentRequest (InternalID, SupplierID+)>

<!--
    The data associated with a particular subscription.
-->
<!ELEMENT SubscriptionContentResponse (Subscription, SubscriptionContent+)>

<!--
    The actual content associated with a particular subscription.
-->
<!ELEMENT SubscriptionContent (CIFContent | Index | Contract)>
<!ATTLIST SubscriptionContent
    filename  %string;  #IMPLIED
>

<!--
    Contents of CIF file in base64 encoding.
-->
<!ELEMENT CIFContent (#PCDATA)> <!-- bin.base64 -->

<!--
    Indicates that something has changed in the supplier data for
    a supplier the buyer has a relationship with. Since this is a message, no
    Request needs to be sent to receive this Message.
-->
<!ELEMENT SupplierChangeMessage (Supplier+)>
<!ATTLIST SupplierChangeMessage
    type  (new | update | delete)  #REQUIRED
>

<!--
    Requests for a complete list of suppliers the buyer currently has
    relationships with.
-->
<!ELEMENT SupplierListRequest EMPTY>

<!--
    The list of suppliers requested by SupplierListRequest.
-->
<!ELEMENT SupplierListResponse (Supplier+)>

<!--
    Requests for a data associated with a particular supplier identified by
    SupplierID.
-->
<!ELEMENT SupplierDataRequest (SupplierID+)>

<!--
    The data associated with the desired supplier.
-->
<!ELEMENT SupplierDataResponse (Supplier)>
