import axios from "axios";
import {z} from "zod";
import {ApprovalSchema} from "../../../schema/ApprovalsQuery";
import {ProductPromotionSchema} from "../../../schema/ProductPromotionsQuery";
import { SubscriberSchema} from "../../../schema/SubscriberQuery";
import {createKey} from "next/dist/shared/lib/router/router";

export const Schema = z.object({
    subscriberComplex: z.object({
        bonusSlots: z.object({
            bonusSlot: z.array(z.object({
                productId: z.string(),
                productName: z.string(),
                type: z.string(),
                allowedModification: z.string().nullable(),
                category: z.string(),
                status: z.string(),
                iconURL: z.string(),
                description: z.string(),
                activeTo: z.string(),
                instanceId: z.number(),
            })),
        }),
        approvals: z.object({
            approval: z.array(ApprovalSchema),
        }),
        appSlots: z.array(
            z.object({
                appSlot: z.array(
                    z.object({
                        productId: z.string(),
                        productName: z.string().nullable(),
                        type: z.string(),
                        allowedModification: z.string(),
                        assignedAppId: z.string().nullable(),
                        apps: z.object({
                            app: z.array(
                                z.object({
                                    productId: z.string(),
                                    productName: z.string().nullable(),
                                    category: z.string(),
                                    status: z.string(),
                                    allowedModification: z.string(),
                                    iconURL: z.string(),
                                    description: z.string(),
                                    activeTo: z.string().nullable(), // Adjusted to use .nullable() for strings
                                    instanceId: z.number().nullable(), // Adjusted to use .number() for integers
                                    productGroup: z.string(),
                                }),
                            ),
                        }),
                    }),
                ),
            }),
        ),
        productPromotions: z.object({
            productPromotion: z.array(ProductPromotionSchema),
        }),
        servicesAndUsage: z.object({
            service: z.array(z.object({
                productId: z.string(),
                productName: z.string(),
                serviceGroup: z.string(),
                status: z.string(),
                activateOn: z.string().optional(),
                listPriority: z.number(),
                instanceId: z.number().optional(),
                "allowedModification.v2": z.string().optional(),
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
        }),
        ssoAccount:  z.object({
            otp: z.string().optional(),
            otpValidTo: z.string().optional(),
        }),
        subscriber: SubscriberSchema,
    })
});
export async function getServerSideProps(context) {
    try {
        const response = await axios.get('http://localhost:8080/subComplex');

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
    const productPromotions = finalData.finalData.subscriberComplex.productPromotions.productPromotion
    const services = finalData.finalData.subscriberComplex.servicesAndUsage.service
    const servicesAndUsageQuery = finalData.finalData.subscriberComplex.servicesAndUsage
    return (
        <div>
            <div>
                <h1>Product Promotions</h1>
                <ul>
                    {productPromotions.map((productPromotion) => (
                        <li key={productPromotion.promotionId}>
                            {productPromotion.header} - {productPromotion.subHeader}
                            <p>{productPromotion.promotionId}</p>
                            <p>{productPromotion.actionLabel}</p>
                            <p>{productPromotion.backgroundColour}</p>
                            <p>{productPromotion.backgroundColourType}</p>
                            <p>{productPromotion.backgroundImageURL}</p>
                            <p>{productPromotion.content}</p>
                            <p>{productPromotion.text}</p>
                            <p>{productPromotion.offerRestrictedPeriod}</p>
                            <p>{productPromotion.nboStory}</p>
                            <p>{productPromotion.priority}</p>
                            <p>{productPromotion.source}</p>
                            <p>{productPromotion.promoExternalId}</p>
                            <p>{productPromotion.promoGroup}</p>
                            <p>{productPromotion.promotionAnswer.id}</p>
                            <p>{productPromotion.promotionAnswer.priority}</p>
                            <p>{productPromotion.promotionAnswer.displayValue}</p>
                        </li>
                    ))}
                </ul>

            </div>

            <div>
                <h1>Services</h1>
                <ul>
                    {services.map((service) => (
                        <li key={service.productId}>
                            {service.productName} - {service.serviceGroup}
                            <p>{service.productId}</p>
                            <p>{service.status}</p>
                            <p>{service.activateOn}</p>
                            <p>{service.listPriority}</p>
                            <p>{service.instanceId}</p>
                            <p>{service.allowedModification}</p>
                            <p>{service.type}</p>
                            <p>{service.priceWithVAT}</p>
                            <p>{service.listPriceWithVAT}</p>
                            <p>{service.period}</p>
                            <p>{service.protectionPeriodEndDate}</p>
                            <p>{service.validTo}</p>
                            <p>{service.isMultiInstance}</p>
                            <p>{service.activationCode}</p>
                            <p>{service.priceLevels?.priceList}</p>
                            <p>{service.priceLevels?.priceWithVAT}</p>
                            <p>{service.priceLevels?.isActive}</p>
                            <p>{service.priceLevels?.isEnabled}</p>
                            <p>{servicesAndUsageQuery.usageAt}</p>
                            <p>{servicesAndUsageQuery.usageSummary.priceAfterAppliedFU}</p>
                            <p>{servicesAndUsageQuery.usageSummary.priceAfterAppliedFUWithVAT}</p>
                            <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeUnit}</p>
                            <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeQuantity}</p>
                            <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeValue}</p>
                            <p>{servicesAndUsageQuery.usageSummary.accummulatedCharges.chargeValueWithVAT}</p>
                            <p>{servicesAndUsageQuery.lastRoamingZone}</p>
                        </li>
                    ))}
                </ul>
            </div>


        </div>
    );
}