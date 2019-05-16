
const initialProductDetailAltValues = (product) => {
  return ({
    itemStatus: product.essentials.itemStatus || '',
    category: product.essentials.category || '',
    subCategory: product.essentials.subCategory || '',
    brand: product.essentials.brand || '',
    essentialsItemNumber: product.essentials.itemNumber || '',
    itemName: product.essentials.itemName || '',
    MOQ: product.essentials.MOQ || '',
    testCertificate: (product.essentials.testCertificate && product.essentials.testCertificate.toString()) || '',
    leadTime: product.essentials.leadTime || '',
    sampleCost: product.essentials.sampleCost || '',
    sampleLeadTime: product.essentials.sampleLeadTime || '',
    imageUrl: product.essentials.imageUrl || [],

    supplierOptions: [],

    // supplierItemNumber: '',
    name: product.supplier[0]._company.about.name || '',
    // status: '',
    // factorySubcontractor: '',
    // contactName: '',
    // contact: '',

    // color,
    // customerItemNumber,
    // exclusivity,
    shortDescription: product.descriptions.shortDescription || '',
    // longDescription,
    // composition,
    // internalRemark,
    // marketPlaceDescription,

    incoterm: (product.logistics && product.logistics.incoterm) || '',
    port: (product.logistics && product.logistics.port) || '',

    currency: (product.cost && product.cost.productsCost && product.cost.productsCost[0].currency) || '',
    factoryPrice: (product.cost && product.cost.productsCost && product.cost.productsCost[0].cost) || '',
    sellingPrice: (product.cost && product.cost.productsCost && product.cost.productsCost[0].cost) || '',
    quantity: (product.cost && product.cost.productsCost && product.cost.productsCost[0].quantity) || '',

    w: (product.logistics && product.logistics.unit.w) || '',
    h: (product.logistics && product.logistics.unit.h) || '',
    l: (product.logistics && product.logistics.unit.l) || '',

    units: (product.logistics && product.logistics.exportCarton.units) || '',
    volume: (product.logistics && product.logistics.exportCarton.volume) || '',

    pack: (product.logistics && product.logistics.packaged.volume) || ''
    // productManager: '',
    // procurementManager: '',
    // qualityManager: '',
    // marketingmanager: ''
  })
}

export { initialProductDetailAltValues }
