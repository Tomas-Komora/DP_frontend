import axios from "axios";
import {z} from "zod";
import {ApprovalSchema} from "../../schema/ApprovalsQuery";
import {ProductPromotionSchema} from "../../schema/ProductPromotionsQuery";
import { SubscriberSchema} from "../../schema/SubscriberQuery";

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
    const subscriber = finalData.finalData.subscriberComplex.subscriber
    const approvals = finalData.finalData.subscriberComplex.approvals.approval
    return (
        <div>
            <div>
                <h1>Subscriber Information</h1>
                <p>Subscriber Name: {subscriber.BPFirstName}</p>
                <p>Subscriber ID: {subscriber.subscriberId}</p>
                <p>MSISDN: {subscriber.msisdn}</p>
                <p>Subscriber Type: {subscriber.subscriberType}</p>
                <p>Email: {subscriber.email.BPEmail}</p>
                <p>Activation Date: {subscriber.activationDate}</p>
                <h2>Tariffs</h2>
                <ul>
                    {subscriber.tariffs.map((tariff, index) => (
                        <li key={index}>
                            {tariff.tariffName} - Status: {tariff.status}
                        </li>

                    ))}
                </ul>
                <p>Eligible for App: {subscriber.eligibleForApp}</p>
                <p>Asset Last Updated At: {subscriber.assetLastUpdatedAt}</p>
                <p>Status: {subscriber.status}</p>
                <p>Status Date: {subscriber.statusDate}</p>
                <p>Status Reason: {subscriber.statusReason}</p>
                <p>BACuRefNo: {subscriber.BACuRefNo}</p>
                <p>Address: {subscriber.BAName}</p>
                <p>is Business Segment: {subscriber.isBusinessSegment}</p>
                <p>self Service Management: {subscriber.selfServiceManagement}</p>
                <p>end Of BC: {subscriber.endOfBC}</p>
                <p>start Of BC: {subscriber.startOfBC}</p>
                <p>days Till End Of BC: {subscriber.daysTillEndOfBC}</p>
                <p>bill Cycle Id: {subscriber.billCycleId}</p>
                <p>is Changed Tariff In Current Bc: {subscriber.isChangedTariffInCurrentBc}</p>
                <p>bill Media Type: {subscriber.billMediaType}</p>
                <p>has More Subscribers: {subscriber.hasMoreSubscribers}</p>
                <p>has More Billing Arrangements: {subscriber.hasMoreBillingArrangements}</p>

            </div>

            <h1>Approvals</h1>
            {approvals.map((approval, index) => (
                <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <h2>{approval.name}</h2>
                    <p>Approved: {approval.approved ? 'Yes' : 'No'}</p>
                    <p>Valid From: {approval.validFrom}</p>
                    <p>Is Channel Settable: {approval.isChannelSettable ? 'Yes' : 'No'}</p>
                    <p>Is Approval Settable: {approval.isApprovalSettable ? 'Yes' : 'No'}</p>
                    <p>Communication Channels:</p>
                    {approval.communicationChannels && <ul>
                        {approval.communicationChannels.communicationChannel.length > 0 ? (
                            approval.communicationChannels.communicationChannel.map((channel, channelIndex) => (
                                <li key={channelIndex}>{channel}</li>
                            ))
                        ) : (
                            <li>None</li>
                        )}
                    </ul>}
                </div>
            ))}

        </div>
    );
}