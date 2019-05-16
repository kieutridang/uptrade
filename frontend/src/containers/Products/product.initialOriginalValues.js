
const initialProductValues = {
  itemStatus: '',
  category: '',
  // subCategory: '',
  // brand: '',
  essentialsItemNumber: '',
  itemName: '',
  // MOQ: '',
  // testCertificate: '',
  // formAE: '',
  // leadTime: '',
  sampleCost: 0
  // sampleLeadTime: ''
  // imageUrl: '',

  // supplierItemNumber: '',
  // name: '',
  // status: '',
  // factorySubcontractor: '',
  // contactName: '',
  // contact: '',
  // color: '',
  // customerItemNumber: '',
  // exclusivity: '',
  // shortDescription: '',
  // longDescription: '',
  // composition: '',
  // internalRemark: '',
  // marketPlaceDescription: '',

  // productManager: '',
  // procurementManager: '',
  // qualityManager: '',
  // marketingmanager: ''
}

const initialUsersProduct = (users) => {
  if (users) {
    const { productManager, procurementManager, qualityManager, marketingManager } = users
    return {
      productManager: (productManager && productManager._id) || '',
      procurementManager: (procurementManager && procurementManager._id) || '',
      qualityManager: (qualityManager && qualityManager._id) || '',
      marketingManager: (marketingManager && marketingManager._id) || ''
    }
  }
  return {
    productManager: '',
    procurementManager: '',
    qualityManager: '',
    marketingManager: ''
  }
}

export { initialProductValues, initialUsersProduct }
