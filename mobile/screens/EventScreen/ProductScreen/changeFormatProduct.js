
function changeFormat (product, id, eventId) {
  const {
    testCertificate, sampleLeadTime, sampleCost, leadTime, cbm, port, incoterm, cartonPack,
    MOQ, unit, supplier, supplierCurrency, sellingPrice, factoryPrice, sellingCurrency,
    country, CBM, sizeW, sizeL, sizeH, itemName, imageUrl, createdAt, updatedAt
  } = product
  let productServerForm = {
    _id: id,
    isNew: true,
    status: 'EVENTS',
    supplier: supplier,
    essentials: {
      imageUrl,
      itemName,
      testCertificate,
      sampleLeadTime,
      sampleCost,
      leadTime,
      cbm,
      MOQ
    },
    logistics: {
      incoterm,
      origin: country,
      port,
      unit: {
        units: unit,
        w: sizeW,
        h: sizeH,
        l: sizeL
      },
      exportCarton: {
        units: cartonPack,
        volume: CBM
      }
    },
    cost: {
      productsCost: [{
        supplier,
        quantity: 1,
        currency: supplierCurrency,
        cost: factoryPrice
      }],
      marketPlacePrice: {
        supplier,
        quantity: 1,
        currency: sellingCurrency,
        cost: sellingPrice
      }
    },
    eventId,
    createdAt: createdAt,
    updatedAt: updatedAt
  }
  return productServerForm
}

export { changeFormat }
