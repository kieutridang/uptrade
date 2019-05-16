function addFieldDefaultUser (user) {
  user.mobileProductSetting = {
    availableField: {
      category: true,
      subCategory: true,
      brand: true,
      itemStatus: true,
      logistic_origin: true,
      itemNumber: true,
      MOQ: true,
      testCertificate: true,
      formAE: true,
      leadTime: true,
      sampleCost: true,
      sampleLeadTime: true,
      supplier: true,
      color: true,
      customerItemNumber: true,
      exclusivity: true,
      shortDescription: true,
      longDescription: true,
      composition: true,
      marketPlaceDescription: true,
      internalRemark: true,
      supplierCurrency: true,
      factoryPrice: true,
      sellingCurrency: true,
      sellingPrice: true,
      unit: true,
      incoterm: true,
      port: true,
      sizeW: true,
      sizeH: true,
      sizeL: true,
      cartonPack: true,
      CBM: true
    }
  }
}

module.exports = { addFieldDefaultUser }
