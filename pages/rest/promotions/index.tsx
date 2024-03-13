import axios from "axios";
import {z} from "zod";
import {ApprovalSchema} from "../../../schema/ApprovalsQuery";
import {ProductPromotionSchema} from "../../../schema/ProductPromotionsQuery";
import { SubscriberSchema} from "../../../schema/SubscriberQuery";
import {createKey} from "next/dist/shared/lib/router/router";

export const Schema = z.object({
    subscriberComplex: z.object({
        productPromotions: z.object({
            productPromotions: z.object({
                productPromotion: z.array(ProductPromotionSchema),
            })

        }),
        servicesAndUsages: z.object({
        servicesAndUsage: z.object({
            service: z.array(z.object({
                productId: z.string(),
                productName: z.string(),
                serviceGroup: z.string(),
                status: z.string(),
                activateOn: z.string().optional(),
                listPriority: z.number(),
                instanceId: z.number().optional(),
                type: z.string().optional(),
                priceWithVAT: z.number().optional(),
                listPriceWithVAT: z.number().optional(),
                period: z.string().optional(),
                protectionPeriodEndDate: z.string().optional(),
                validTo: z.string().optional(),
                isMultiInstance: z.boolean().optional(),
                activationCode: z.string().optional(),
                priceLevels: z.array(z.object({
                    priceList: z.string(),
                    priceWithVAT: z.number(),
                    isEnabled: z.boolean(),
                    isActive: z.boolean().optional(),
                })).optional(),
            })),
            usageAt: z.string(),
            usageSummary: z.object({
                priceAfterAppliedFU: z.number(),
                priceAfterAppliedFUWithVAT: z.number(),
                accummulatedCharges: z.array(z.object({
                    chargeUnit: z.string(),
                    chargeQuantity: z.number().optional(),
                    chargeValue: z.number().optional(),
                    chargeValueWithVAT: z.number().optional(),
                })),
            }),
            lastRoamingZone: z.number(),
        }) })
    })
});
export async function getServerSideProps(context) {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/subComplex');

        const headersPlainObject = Object.entries(response.headers).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
        const finalData = Schema.parse(response.data)
        return {
            props: {
                finalData,

            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                error: 'Failed to fetch data.',
            },
        };
    }
}

export default function Home(finalData) {
    //console.log(finalData.finalData.subscriberComplex)
    const productPromotions = finalData.finalData.subscriberComplex.productPromotions.productPromotions.productPromotion
    const services = finalData.finalData.subscriberComplex.servicesAndUsages.servicesAndUsage.service
    const servicesAndUsageQuery = finalData.finalData.subscriberComplex.servicesAndUsages.servicesAndUsage
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
    );
}