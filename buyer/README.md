# 購買アプリケーションサンプル

## 環境設定

Start catalog_server before start this app.

## 実行

For development
```
npm run dev
```
For deployement
```
npm run start
```

## PunchOutOrderMessage

カタログサーバーから受信したもの。(xml-body-parserでJSONに変換されたもの)

```
{
  "declaration": {
    "attributes": {
      "version": "1.0"
    }
  },
  "elements": [
    {
      "type": "element",
      "name": "cXML",
      "attributes": {
        "payloadID": "456778-198@premier.workchairs.com",
        "xml:lang": "en-US",
        "timestamp": "2019-03-04T00:04:20+09:00"
      },
      "elements": [
        {
          "type": "element",
          "name": "Header",
          "elements": [
            {
              "type": "element",
              "name": "From",
              "elements": [
                {
                  "type": "element",
                  "name": "Credential",
                  "attributes": {
                    "domain": "DUNS"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "Identity",
                      "elements": [
                        {
                          "type": "text",
                          "text": "942888711"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "element",
              "name": "To",
              "elements": [
                {
                  "type": "element",
                  "name": "Credential",
                  "attributes": {
                    "domain": "AribaNetworkUserId"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "Identity",
                      "elements": [
                        {
                          "type": "text",
                          "text": "admin@acme.com"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "element",
              "name": "Sender",
              "elements": [
                {
                  "type": "element",
                  "name": "Credential",
                  "attributes": {
                    "domain": "DUNS"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "Identity",
                      "elements": [
                        {
                          "type": "text",
                          "text": "942888711"
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "element",
                  "name": "UserAgent",
                  "elements": [
                    {
                      "type": "text",
                      "text": "CatalogServer"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "element",
          "name": "Message",
          "elements": [
            {
              "type": "element",
              "name": "PunchOutOrderMessage",
              "elements": [
                {
                  "type": "element",
                  "name": "BuyerCookie",
                  "elements": [
                    {
                      "type": "text",
                      "text": "34234234ADFSDF234234"
                    }
                  ]
                },
                {
                  "type": "element",
                  "name": "PunchOutOrderMessageHeader",
                  "attributes": {
                    "operationAllowed": "edit"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "Total",
                      "elements": [
                        {
                          "type": "element",
                          "name": "Money",
                          "attributes": {
                            "currency": "JPY"
                          },
                          "elements": [
                            {
                              "type": "text",
                              "text": "604800"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "element",
                  "name": "ItemIn",
                  "attributes": {
                    "quantity": "1"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "ItemID",
                      "elements": [
                        {
                          "type": "element",
                          "name": "SupplierPartID",
                          "elements": [
                            {
                              "type": "text",
                              "text": "1"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "SupplierPartAuxiliaryID"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "ItemDetail",
                      "elements": [
                        {
                          "type": "element",
                          "name": "UnitPrice",
                          "elements": [
                            {
                              "type": "element",
                              "name": "Money",
                              "attributes": {
                                "currency": "JPY"
                              },
                              "elements": [
                                {
                                  "type": "text",
                                  "text": "280000"
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "Description",
                          "elements": [
                            {
                              "type": "text",
                              "text": "Duncanのジャズピックアップ搭載のホローボディー。現代的なサウンドを奏でる使いやすいギターです。"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "UnitOfMeasure",
                          "elements": [
                            {
                              "type": "text",
                              "text": "EA"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "Classification",
                          "attributes": {
                            "domain": "SPSC"
                          },
                          "elements": [
                            {
                              "type": "text",
                              "text": "12345"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "ManufacturerPartID",
                          "elements": [
                            {
                              "type": "text",
                              "text": "man-part-id"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "ManufacturerName",
                          "elements": [
                            {
                              "type": "text",
                              "text": "椿工藝舎"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "type": "element",
                  "name": "ItemIn",
                  "attributes": {
                    "quantity": "1"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "ItemID",
                      "elements": [
                        {
                          "type": "element",
                          "name": "SupplierPartID",
                          "elements": [
                            {
                              "type": "text",
                              "text": "2"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "SupplierPartAuxiliaryID"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "ItemDetail",
                      "elements": [
                        {
                          "type": "element",
                          "name": "UnitPrice",
                          "elements": [
                            {
                              "type": "element",
                              "name": "Money",
                              "attributes": {
                                "currency": "JPY"
                              },
                              "elements": [
                                {
                                  "type": "text",
                                  "text": "280000"
                                }
                              ]
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "Description",
                          "elements": [
                            {
                              "type": "text",
                              "text": "ハイパワーピックアップ搭載で軽量なソリッドモデルです。"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "UnitOfMeasure",
                          "elements": [
                            {
                              "type": "text",
                              "text": "EA"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "Classification",
                          "attributes": {
                            "domain": "SPSC"
                          },
                          "elements": [
                            {
                              "type": "text",
                              "text": "12345"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "ManufacturerPartID",
                          "elements": [
                            {
                              "type": "text",
                              "text": "man-part-id"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "ManufacturerName",
                          "elements": [
                            {
                              "type": "text",
                              "text": "椿工藝舎"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```