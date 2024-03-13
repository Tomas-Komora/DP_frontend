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
        <div className="mt-6 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
                <div className="py-5 grid grid-cols-2 sm:gap-4 sm:px-6">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Subscriber Information</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Subscriber Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.bpfirstName}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Subscriber ID</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.subscriberId}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">MSISDN</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.msisdn}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Subscriber Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.subscriberType}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.email.bpemail}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Activation Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.activationDate}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Tariffs</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                        <ul role="list" className="divide-y divide-gray-200">
                                            {subscriber.tariffs.map((tariff, index) => (
                                                <li key={index} className="py-4">{tariff.tariffName} - Status: {tariff.status}</li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Eligible for App</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.eligibleForApp}</dd>
                                </div>
                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Asset Last Updated At</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.assetLastUpdatedAt}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.status}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status Date</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.statusDate}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status Reason</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.statusReason}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">BACuRefNo</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.bacuRefNo}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.baname}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Is Business Segment</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{String(subscriber.businessSegment)}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Self Service Management</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.selfServiceManagement}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">End Of BC</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.endOfBC}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Start Of BC</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.startOfBC}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Days Till End Of BC</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.daysTillEndOfBC}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Bill Cycle Id</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.billCycleId}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Is Changed Tariff In Current BC</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{String(subscriber.changedTariffInCurrentBc)}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Bill Media Type</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{subscriber.billMediaType}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Has More Subscribers</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{String(subscriber.hasMoreSubscribers)}</dd>
                                </div>

                                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Has More Billing Arrangements</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{String(subscriber.hasMoreBillingArrangements)}</dd>
                                </div>


                            </dl>
                        </div>
                    </div>



                    {/* Approvals Section */}
                    <div className="mt-16 border-t border-gray-200 bg-white shadow overflow-hidden pt-6">
                        <h3 className="text-lg font-semibold leading-7 text-gray-900">Approvals</h3>
                        {approvals.map((approval, index) => (
                            <div key={index} className="divide-y divide-gray-200">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium text-gray-900">{approval.name}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                        Approved: {approval.approved ? 'Yes' : 'No'}<br />
                                        Valid From: {approval.validFrom}<br />
                                        Is Channel Settable: {approval.isChannelSettable ? 'Yes' : 'No'}<br />
                                        Is Approval Settable: {approval.isApprovalSettable ? 'Yes' : 'No'}
                                        <ul className="mt-2 divide-y divide-gray-200">
                                            {approval.communicationChannels?.communicationChannel.length > 0 ? (
                                                approval.communicationChannels?.communicationChannel.map((channel, channelIndex) => (
                                                    <li key={channelIndex} className="py-4">{channel}</li>
                                                ))
                                            ) : (
                                                <li className="py-4">None</li>
                                            )}
                                        </ul>
                                    </dd>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </dl>
        </div>
    );
}