<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Item.mod#18 $
-->

<!--
    Must be a UN/CEFACT (Recommendation 20) unit of measure code.
-->
<!ELEMENT UnitOfMeasure (#PCDATA)> <!-- nmtoken -->

<!--
    ID with which the item's manufacturer identifies the item.
-->
<!ELEMENT ManufacturerPartID (#PCDATA)> <!-- string -->

<!--
    Name of the item's manufacturer.

    xml:lang
        The language in which the ManufacturerName is written.  This
    attribute will be required in a future version of cXML.  (Leaving it
    out is deprecated.)
-->
<!ELEMENT ManufacturerName (#PCDATA)> <!-- string -->
<!ATTLIST ManufacturerName
    xml:lang %xmlLangCode; #IMPLIED
>

<!--
    Classification is used to group items into similar categories.

    domain
        "name" of classification, ie., SPSC
-->
<!ELEMENT Classification (#PCDATA)> <!-- string -->
<!ATTLIST Classification
    domain  %string;  #REQUIRED
>

<!--
    How the supplier identifies an item they sell.

    If SupplierPartID does not provide a unique key to identify the item,
    then the supplier should generate a key which identifies the part
    uniquely when combined with the SupplierID and SupplierPartID. The
    key is called SupplierPartAuxiliaryID.

    An example is where a Supplier would use the same PartID for an
    item but have a different price for units of "EA" versus "BOX".
    In this case, the ItemIDs should be:
    <ItemID>
        <SupplierPartID>pn12345</SupplierPartID>
        <SupplierPartAuxiliaryID>EA</SupplierPartAuxiliaryID>
    </ItemID>
    <ItemID>
        <SupplierPartID>pn12345</SupplierPartID>
        <SupplierPartAuxiliaryID>
           <foo>well formed XML here</foo>
        </SupplierPartAuxiliaryID>
    </ItemID>
    In this case, the "foo" element must be defined in an internal subset
    sent with the cXML document.  Otherwise, parsers will not be able to
    validate that document.

    In a preferred approach, the sending application may escape the contained
    XML using CDATA sections.  This would appear as:
       ...
       <SupplierPartAuxiliaryID>
           <![CDATA[<foo>well formed XML here</foo>]]>
       </SupplierPartAuxiliaryID>
       ...

    Finally, the angle brackets could be escaped using XML character
    entities.  This might be a bit harder for humans to read.  For example:
       ...
       <SupplierPartAuxiliaryID>
           &lt;foo&gt;well formed XML here&lt;/foo&gt;
       </SupplierPartAuxiliaryID>
       ...
-->
<!ELEMENT SupplierPartID (#PCDATA)> <!-- string -->

<!ELEMENT SupplierPartAuxiliaryID ANY>

<!--
    A unique identification of an item. SupplierID is not required since
    ItemIDs never travel alone.
-->
<!ELEMENT ItemID (SupplierPartID, SupplierPartAuxiliaryID?)>

<!--
    ItemDetail contains detailed information about an item. All the data that
    a user would want to see about an item instead of the bare essentials
    that are represented in the ItemID.
-->
<!ELEMENT ItemDetail (UnitPrice, Description+, UnitOfMeasure,
                      Classification+, ManufacturerPartID?,
                      ManufacturerName?, URL?, Extrinsic*)>
