<!--
    For cXML license agreement information, please see
    http://www.cxml.org/home/license.asp

    $Id: //ariba/specs/cXML/Entities.mod#3 $
-->

<!--
     Top-level entities used in Transport.mod.  Defined here to allow easy
     extention of the cXML specification (using additional DTDs) without
     redefining these entities.
-->

<!-- cxml.messages
     Possible elements (for particular situations) within Message.  These
     are all of the messages defined in the base cXML protocol.
-->
<!ENTITY % cxml.messages "(PunchOutOrderMessage |
                           SubscriptionChangeMessage |
                           SupplierChangeMessage)"
>

<!-- cxml.requests
     Possible elements (for particular situations) within Request.  These
     are all of the requests defined in the base cXML protocol.
-->
<!ENTITY % cxml.requests "(ProfileRequest |
                           OrderRequest |
                           PunchOutSetupRequest |
                           StatusUpdateRequest |
                           GetPendingRequest |
                           SubscriptionListRequest |
                           SubscriptionContentRequest |
                           SupplierListRequest |
                           SupplierDataRequest |
                           CopyRequest)"
>

<!-- cxml.responses
     Possible elements (for particular situations) within Response.  These
     are all of the responses (corresponding to a subset of the possible
     requests) defined in the base cXML protocol.
-->
<!ENTITY % cxml.responses "(ProfileResponse |
                            PunchOutSetupResponse |
                            GetPendingResponse |
                            SubscriptionListResponse |
                            SubscriptionContentResponse |
                            SupplierListResponse |
                            SupplierDataResponse)"
>
