<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Supplier.mod#13 $
-->

<!--
    Supplier of goods and services. Includes a list of SupplierIDs which
    identify the Supplier.

    corporateURL
        URL to web site about the supplier

    storeFrontURL
        URL to web site where a user can shop or browse
-->
<!ELEMENT Supplier (Name, Comments?, SupplierID+, SupplierLocation*)>
<!ATTLIST Supplier
    corporateURL   %URL;  #IMPLIED
    storeFrontURL  %URL;  #IMPLIED
>

<!--
    One of the locations for a supplier. Supplier location is
    generally a physical location.
-->
<!ELEMENT SupplierLocation (Address, OrderMethods)>

<!--
    OrderMethods is the list of methods by which one can order
    from a supplier. The contact element is the technical contact
    who should be able to assist with order processing issues.
    The list is to be ordered by supplier preference, the first
    element having the highest degree of preference.
-->
<!ELEMENT OrderMethods (OrderMethod+, Contact?)>

<!--
    OrderMethod is a method for ordering. It is comprised of a
    target address for the order and the protocol expected by
    the address.
-->
<!ELEMENT OrderMethod (OrderTarget, OrderProtocol?)>

<!--
    OrderTarget represents an address to which orders can be
    sent.
-->
<!ELEMENT OrderTarget (Phone | Email | Fax | URL | OtherOrderTarget)>

<!--
    OrderProtocol is the communication method to be used when
    communicating an order to a supplier. An example would be "cXML".
-->
<!ELEMENT OrderProtocol (#PCDATA)> <!-- string -->

<!--
    OtherOrderTarget represents an address which is not enumerated by
    default in the OrderTarget Element. This may contain address targets
    beyond the ability of this document to describe.

    name
        Optional name for target.
-->
<!ELEMENT OtherOrderTarget ANY>
<!ATTLIST OtherOrderTarget
    name  %string;  #IMPLIED
>

<!--
    Definition of a supplier id.  A supplier id is a (domain, value)
    pair so that suppliers have the flexibility to define their id's
    according to an arbitrary convention (e.g., (DUNS, 12345),
    (TaxID, 88888888)).

    domain
        the domain of the id
-->

<!ELEMENT SupplierID (#PCDATA)> <!-- string -->
<!ATTLIST SupplierID
    domain  %string;  #REQUIRED
>
