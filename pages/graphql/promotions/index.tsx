import { request, gql } from 'graphql-request'

export async function getServerSideProps() {
    const query = gql`
        {
            productPromotionsQuery{
                productPromotion{
                    promotionId
                    actionLabel
                    backgroundColour
                    backgroundColourType
                    backgroundImageURL
                    header
                    subHeader
                    content
                    text
                    offerRestrictedPeriod
                    nboStory
                    priority
                    source
                    promoExternalId
                    promoGroup
                    promotionAnswer{
                        id
                        priority
                        displayValue
                    }
                }
            },
            servicesAndUsageQuery{
                service{
                    productId
                    productName
                    serviceGroup
                    status
                    activateOn
                    listPriority
                    instanceId
                    type
                    priceWithVAT
                    listPriceWithVAT
                    period
                    protectionPeriodEndDate
                    validTo
                    isMultiInstance
                    activationCode
                    priceLevels{
                        priceList
                        priceWithVAT
                        isActive
                        isEnabled
                    }
                }
                usageAt
                usageSummary{
                    priceAfterAppliedFU
                    priceAfterAppliedFUWithVAT
                    accummulatedCharges{
                        chargeUnit
                        chargeQuantity
                        chargeValue
                        chargeValueWithVAT
                    }
                }
                lastRoamingZone
            }
        }
    `

    const data = await request('http://localhost:3000/api/graphql', query)
    const { productPromotionsQuery, servicesAndUsageQuery} = data as any
    return {
        props: {
            productPromotionsQuery,
            servicesAndUsageQuery,
        },
    }

}
export default function Home({ productPromotionsQuery, servicesAndUsageQuery}) {
    const productPromotions = productPromotionsQuery.productPromotion;
    const services = servicesAndUsageQuery.service;
    return (
        <>
        <div className="py-5 grid grid-cols-2 sm:gap-4 sm:px-6">
            <div>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-semibold leading-7 text-gray-900">Product Promotions</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Explore our latest product
                            promotions and offers.</p>
                    </div>
                    <div className="mt-6 border-t border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            {productPromotions.map((productPromotion) => (
                                <div key={productPromotion.promotionId}
                                     className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Promotion Details</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        <p><strong>ID:</strong> {productPromotion.promotionId}</p>
                                        <p><strong>Action Label:</strong> {productPromotion.actionLabel}</p>
                                        <p><strong>Background Colour:</strong> {productPromotion.backgroundColour}</p>
                                        <p><strong>Background Colour
                                            Type:</strong> {productPromotion.backgroundColourType}</p>
                                        <p><strong>Background Image URL:</strong> {productPromotion.backgroundImageURL}
                                        </p>
                                        <p><strong>Content:</strong> {productPromotion.content}</p>
                                        <p><strong>Text:</strong> {productPromotion.text}</p>
                                        <p><strong>Offer Restricted
                                            Period:</strong> {productPromotion.offerRestrictedPeriod}</p>
                                        <p><strong>NBO Story:</strong> {productPromotion.nboStory}</p>
                                        <p><strong>Priority:</strong> {productPromotion.priority}</p>
                                        <p><strong>Source:</strong> {productPromotion.source}</p>
                                        <p><strong>Promo External ID:</strong> {productPromotion.promoExternalId}</p>
                                        <p><strong>Promo Group:</strong> {productPromotion.promoGroup}</p>
                                        <p><strong>Promotion Answer ID:</strong> {productPromotion.promotionAnswer.id}
                                        </p>
                                        <p><strong>Promotion Answer
                                            Priority:</strong> {productPromotion.promotionAnswer.priority}</p>
                                        <p><strong>Promotion Answer Display
                                            Value:</strong> {productPromotion.promotionAnswer.displayValue}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>


            </div>
            <div>
                <h1 className="text-lg font-semibold leading-7 text-gray-900">Services</h1>
                <ul className="mt-6 border-t border-gray-200 divide-y divide-gray-200">
                    {services.map((service) => (
                        <li key={service.productId} className="py-4">
                            <div className="flex flex-col">
                                <span
                                    className="text-sm font-medium text-gray-900">{service.productName} - {service.serviceGroup}</span>
                                <div className="mt-2 grid grid-cols-2 gap-4">
                                    <p>Product ID: {service.productId}</p>
                                    <p>Status: {service.status}</p>
                                    <p>Activate On: {service.activateOn}</p>
                                    <p>List Priority: {service.listPriority}</p>
                                    <p>Instance ID: {service.instanceId}</p>
                                    <p>Allowed Modification: {service.allowedModification}</p>
                                    <p>Type: {service.type}</p>
                                    <p>Price With VAT: {service.priceWithVAT}</p>
                                    <p>List Price With VAT: {service.listPriceWithVAT}</p>
                                    <p>Period: {service.period}</p>
                                    <p>Protection Period End Date: {service.protectionPeriodEndDate}</p>
                                    <p>Valid To: {service.validTo}</p>
                                    <p>Is Multi Instance: {service.isMultiInstance}</p>
                                    <p>Activation Code: {service.activationCode}</p>
                                    <p>Price List: {service.priceLevels?.priceList}</p>
                                    <p>Price Level Price With VAT: {service.priceLevels?.priceWithVAT}</p>
                                    <p>Price Level Is Active: {service.priceLevels?.isActive}</p>
                                    <p>Price Level Is Enabled: {service.priceLevels?.isEnabled}</p>
                                    <p>Usage At: {servicesAndUsageQuery.usageAt}</p>
                                    <p>Price After Applied
                                        FU: {servicesAndUsageQuery.usageSummary.priceAfterAppliedFU}</p>
                                    <p>Price After Applied FU With
                                        VAT: {servicesAndUsageQuery.usageSummary.priceAfterAppliedFUWithVAT}</p>
                                    <p>Charge
                                        Unit: {servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeUnit}</p>
                                    <p>Charge
                                        Quantity: {servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeQuantity}</p>
                                    <p>Charge
                                        Value: {servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeValue}</p>
                                    <p>Charge Value With
                                        VAT: {servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeValueWithVAT}</p>
                                    <p>Last Roaming Zone: {servicesAndUsageQuery.lastRoamingZone}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </>
    )
}