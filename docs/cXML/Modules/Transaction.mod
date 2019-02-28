<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Transaction.mod#30 $
-->

<!--
    For better definitions of these Elements/Entities, refer to the cXML
    Transaction Specification documents.
-->

<!-- Basic transactional elements used throughout -->
<!--
    The total for something.
-->
<!ELEMENT Total (Money)>

<!--
    The bill to for an item.
-->
<!ELEMENT BillTo (Address)>

<!--
    The ship to for a item.
-->
<!ELEMENT ShipTo (Address)>

<!--
    Definition of a cXML Shipping item. Represents a shipping cost in the
    shopping basket (PunchOutOrderMessage) or an order to the supplier
    (OrderRequest). There could be one of these for the entire order, or one
    per lineitem.

    trackingDomain
        represents the logistics supplier, I.E., "FedEx", "UPS", etc.

    trackingId
        an optional element value that represents the logistics supplier
        tracking number

    tracking
        Deprecated - Do Not Use
-->
<!ELEMENT Shipping (Money, Description)>
<!ATTLIST Shipping
    trackingDomain  %string;  #IMPLIED
    trackingId      %string;  #IMPLIED
    tracking        %string;  #IMPLIED
>

<!--
    Defines a Purchasing Card element used for payment
-->
<!ELEMENT PCard (PostalAddress?)>
<!ATTLIST PCard
    number      %number;  #REQUIRED
    expiration  %date;    #REQUIRED
    name        %string;  #IMPLIED
>

<!--
    The list of valid payment types.
-->
<!ENTITY % cxml.payment  "PCard">
<!ELEMENT Payment (%cxml.payment;)>

<!--
    Defines an accounting segment.  Segment is an older, deprecated way to
    transport this information.

    type
        The accounting type of this segment.

    id
        The unique key of this Segment against the type.

    description
        Textual description of the Segment. For human readability.
-->
<!ELEMENT Segment EMPTY>
<!ATTLIST Segment
    type         %string;  #REQUIRED
    id           %string;  #REQUIRED
    description  %string;  #REQUIRED
>

<!--
    Defines an accounting segment.  AccountingSegment is the newer, better
    way to transport this information.  Name corresponds to the type
    attribute of Segment; Description corresponds to description.  Both add
    required locale attributes to the strings.

    id
        The unique key of this Segment against the type.
-->
<!ELEMENT AccountingSegment ( Name, Description )>
<!ATTLIST AccountingSegment
    id           %string;  #REQUIRED
>

<!--
    An accounting object.  Use of the Segment element here is deprecated.

    name
        The name of the object containing the specified accounting segments.
-->
<!ENTITY % cxml.accounting  "( Segment+ | AccountingSegment+ )">
<!ELEMENT Accounting (%cxml.accounting;)>
<!ATTLIST Accounting
    name  %string;  #REQUIRED
>

<!--
    A charge against an Accounting element.
-->
<!ELEMENT Charge (Money)>

<!--
    The combination of a Charge against an Accounting Element. A distribution
    represents the breakdown of one overall amount into sub-amounts.
-->
<!ELEMENT Distribution (Accounting, Charge)>

<!--
    Definition of a cXML Tax item. This represents what a Tax element should
    be in the classic notion of a line on a PO or Invoice. It can also
    represent a per-lineitem tax element depending on where it appears
    (inside of a item ELEMENT or inside of a something like a supplierOrder
    ELEMENT).

    Represents a tax item in the shopping basket. There could be one of these
    for the entire order, or one per lineitem.
-->
<!ELEMENT Tax (Money, Description)>

<!-- Item Elements -->
<!--
    The representation of a line item as it needs to be for sending to a
    supplier.

    quantity
        How many items are desired.
    lineNumber
        Position (counting from 1) of this item in an order.  Used to
        maintain a reference between items in create and update OrderRequest
        documents.
    requisitionID
        The buyers system requisition id for this line item. It might be the
        same as orderID, and it might not be included at all.  Must not be
        included if requisitionID is specified in the OrderRequestHeader.
    requestedDeliveryDate
        The date this item was requested for delivery.
-->
<!ELEMENT ItemOut (ItemID, ItemDetail?, SupplierID?, ShipTo?, Shipping?,
                   Tax?, Distribution*, Contact*, Comments?)>
<!ATTLIST ItemOut
    quantity               %r8;      #REQUIRED
    lineNumber             %uint;    #IMPLIED
    requisitionID          %string;  #IMPLIED
    requestedDeliveryDate  %date;    #IMPLIED
>

<!--
    The representation of a line item as it needs to be for sending to a
    buyer.

    quantity
        How many items are desired.
    lineNumber
        Position (counting from 1) of this item in an order.  Used to
        maintain a reference between items in create and update OrderRequest
        documents.
-->
<!ELEMENT ItemIn (ItemID, ItemDetail, SupplierID?, ShipTo?, Shipping?, Tax?)>
<!ATTLIST ItemIn
    quantity   %r8;      #REQUIRED
    lineNumber %uint;    #IMPLIED
>

<!-- OrderRequest* Elements -->
<!--
    Definition of an order.  This is the data that is sent to the supplier
    to have them place an order in their order management system. The new
    world order equivalent of a PO.
-->
<!ELEMENT OrderRequest (OrderRequestHeader, ItemOut+)>

<!--
    Header of an order.  This is the data that is sent to the supplier
    to have them place an order in their order management system. Money
    represents the total amount of this order.

    orderID
        The buyer system orderID for this request. Basically, what the PO
        number is today.

    orderDate
        The date and time the order request was created.

    type
        The type of the order request. Defaults to "new".

    requisitionID
        The buyers system requisition id for this entire order. It might be
        the same as orderID, and it might not be included at all.  Must not
        be included if requisitionID is specified in any ItemOut elements.

    shipComplete
        Optional preference for "hold until complete" processing.  Defaults
        to shipping when available if not specified.  Future versions of the
        protocol may extend the datatype of this attribute to include
        additional possible values (such as "unlessGreatlyBackOrdered"?).

    The contained DocumentReference element would appear in a document only
    when the type is "update" or "delete".  In that case, the
    DocumentReference would reference the most recent OrderRequest document
    for the order.  For example when an order is created, updated and then
    deleted, the final document should contain a DocumentReference
    referring to the OrderRequest with type="update".  That document would,
    in turn, refer to the original (type="new") OrderRequest document.
-->
<!ELEMENT OrderRequestHeader (Total, ShipTo?, BillTo, Shipping?, Tax?,
                              Payment?, Contact*, Comments?, Followup?,
                              DocumentReference?, Extrinsic*)>
<!ATTLIST OrderRequestHeader
    orderID    %string;        #REQUIRED
    orderDate  %datetime.tz;   #REQUIRED
    type       (new | update | delete)  "new"
    requisitionID   %string;   #IMPLIED
    shipComplete    (yes)      #IMPLIED
>

<!-- Followup

     Location to which future StatusUpdateRequest documents should be
     posted.  In general, this is the input location for any later
     documents which reference the current OrderRequest document.
-->
<!ELEMENT Followup (URL)>

<!-- PunchOut* Elements -->
<!--
     Definition of a PunchOut Setup Request.  This is the data that is sent
     to the external system that the Ariba ORMS is going to extract catalog
     data from.

     The BrowserFormPost element contains the URL we would like the browser
     re-directed to when the PunchOut shopping experience is finished (where
     the PunchOutOrder message should be returned).
-->
<!ELEMENT PunchOutSetupRequest (BuyerCookie, Extrinsic*, BrowserFormPost?,
                                Contact*, SupplierSetup?, ShipTo?,
                SelectedItem?, ItemOut*)>
<!ATTLIST PunchOutSetupRequest
    operation  (create | inspect | edit)  #REQUIRED
>

<!ELEMENT BuyerCookie ANY> <!-- any valid XML data -->

<!ELEMENT BrowserFormPost (URL)>
<!ELEMENT SelectedItem (ItemID)>
<!ELEMENT SupplierSetup (URL)>

<!ELEMENT PunchOutSetupResponse (StartPage)>
<!ELEMENT StartPage (URL)>

<!--
     Definition of a PunchOut Order Message.  This is the data that is sent
     back to the Ariba ORMS system from the external system that the PunchOut
     Request was targeted at.
-->
<!ELEMENT PunchOutOrderMessage (BuyerCookie, PunchOutOrderMessageHeader,
                                ItemIn*)>

<!--
     Header of a PunchOut Order Request.  This is the data that is sent from
     the supplier to transfer the supplier acquired shopping basket back to
     the buyer system.

     operationAllowed
          Highest operation allowed on the PunchOut shopping basket.
          "create" allows only later OrderRequest operations on these items.
          "inspect" adds a PunchOutSetupRequest with operation="inspect".
          And, "edit" allows operation="edit" in that later Setup request.
-->
<!ELEMENT PunchOutOrderMessageHeader (Total, ShipTo?, Shipping?, Tax?)>
<!ATTLIST PunchOutOrderMessageHeader
    operationAllowed  (create | inspect | edit)  #REQUIRED
>

<!--
    Request to update the status of an earlier order.
-->
<!ELEMENT StatusUpdateRequest  (DocumentReference, Status)>

<!--
    Request to forward a cXML document to another party.
    This Request occurs in both cXML.dtd and Private.dtd.
    and is used depending in which dtd the forwarded message resides. 
-->
<!ELEMENT CopyRequest (cXML)>
