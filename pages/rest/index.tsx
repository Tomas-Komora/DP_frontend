import axios from "axios";
import {z} from "zod";
import {ApprovalSchema} from "../../schema/ApprovalsQuery";
import {ProductPromotionSchema} from "../../schema/ProductPromotionsQuery";
import { SubscriberSchema} from "../../schema/SubscriberQuery";

export const Schema = z.object({
        subscriberComplex: z.object({
            approvals: z.object({
                approvals: z.object({
                    approval: z.array(z.object({
                        name: z.string(),
                        approved: z.boolean(),
                        validFrom: z.string().nullable(),
                        isApprovalSettable: z.boolean().nullable(),
                        approvalCheckboxName: z.string().nullable(),
                        communicationChannels: z.object({
                            communicationChannel: z.array(z.string()).nullable(),
                        }).nullable(),
                    })),
                }),
            }),

            subscriber: z.object({
                subscriber: SubscriberSchema
            }),
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
    const subscriber = finalData.finalData.subscriberComplex.subscriber.subscriber
    // console.log(finalData.finalData.subscriberComplex)
    const approvals = finalData.finalData.subscriberComplex.approvals.approvals.approval
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