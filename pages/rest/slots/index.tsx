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
    const appSlots = finalData.finalData.subscriberComplex.appSlots[0].appSlot
    const bonusSlots = finalData.finalData.subscriberComplex.bonusSlots.bonusSlot
    return (
        <div>
            <div>
                <h1>App Slots</h1>
                <ul>
                    {appSlots.map((appSlot) => (
                        <li key={appSlot.productId}>
                            <h2>{appSlot.productName}</h2>
                            <p>{appSlot.type}</p>
                            <p>{appSlot.allowedModification}</p>
                            <p>{appSlot.assignedAppId}</p>
                            <ul>
                                {appSlot.apps.app.map((app) => (
                                    <li key={app.productId}>
                                        <h3>{app.productName}</h3>
                                        <p>{app.category}</p>
                                        <p>{app.status}</p>
                                        <p>{app.allowedModification}</p>
                                        <p>{app.iconURL}</p>
                                        <p>{app.activeTo}</p>
                                        <p>{app.description}</p>
                                        <p>{app.instanceId}</p>
                                        <p>{app.productGroup}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h1>Bonus Slots</h1>
                <ul>
                    {bonusSlots.map((bonusSlot) => (
                        <li key={bonusSlot.productId}>
                            <h2>{bonusSlot.productName}</h2>
                            <p>{bonusSlot.type}</p>
                            <p>{bonusSlot.allowedModification}</p>
                            <p>{bonusSlot.category}</p>
                            <p>{bonusSlot.status}</p>
                            <p>{bonusSlot.iconURL}</p>
                            <p>{bonusSlot.description}</p>
                            <p>{bonusSlot.activeTo}</p>
                            <p>{bonusSlot.instanceId}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}