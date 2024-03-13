import { request, gql } from 'graphql-request'

export async function getServerSideProps() {
    const query = gql`
        {
            subscriberQuery{
                subscriber{
                    scratchDay
                    eligibleForApp
                    subscriberType
                    subscriberId
                    msisdn
                    assetLastUpdatedAt
                    tariffs{
                        tariffId
                        tariffName
                        tariffType
                        tariffTypeEnum
                        status
                        includedSubscriptionSlots
                    }
                    activationDate
                    status
                    statusDate
                    statusReason
                    bacuRefNo
                    baname
                    bpfirstName
                    bpcuRefNo
                    businessSegment
                    selfServiceManagement
                    endOfBC
                    startOfBC
                    daysTillEndOfBC
                    billCycleId
                    changedTariffInCurrentBc
                    billMediaType
                    email{
                        bpemail
                        zekVerificationStatus}
                    settings{hasDigitalBox
                        hasInvoicePaymentCharge
                        hasEbillBillMediaType
                        hasMktForMobappDisabled}
                    hasMoreSubscribers
                    hasMoreBillingArrangements
                }
            }
            approvalsQuery{
                approval{
                    name
                    approved
                    communicationChannels{
                        communicationChannel
                    }
                    validFrom
                    isChannelSettable
                    isApprovalSettable
                }
            }
        }
    `

    const data = await request('http://localhost:3000/api/graphql', query)
    const {  subscriberQuery, approvalsQuery  } = data as any
    return {
        props: {
            subscriberQuery,
            approvalsQuery,
        },
    }

}
export default function Home({ approvalsQuery, subscriberQuery }) {
    const subscriber = subscriberQuery.subscriber
    const approvals = approvalsQuery.approval
    return (
        <div className="bg-blue">
        <div>
            <h1>Subscriber Information</h1>
            <p>Subscriber Name: {subscriber.bpfirstName}</p>
            <p>Subscriber ID: {subscriber.subscriberId}</p>
            <p>MSISDN: {subscriber.msisdn}</p>
            <p>Subscriber Type: {subscriber.subscriberType}</p>
            <p>Email: {subscriber.email.bpemail}</p>
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
            <p>BACuRefNo: {subscriber.bacuRefNo}</p>
            <p>Address: {subscriber.baname}</p>
            <p>is Business Segment: {subscriber.businessSegment}</p>
            <p>self Service Management: {subscriber.selfServiceManagement}</p>
            <p>end Of BC: {subscriber.endOfBC}</p>
            <p>start Of BC: {subscriber.startOfBC}</p>
            <p>days Till End Of BC: {subscriber.daysTillEndOfBC}</p>
            <p>bill Cycle Id: {subscriber.billCycleId}</p>
            <p>is Changed Tariff In Current Bc: {subscriber.changedTariffInCurrentBc}</p>
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
                        <ul>
                            {approval.communicationChannels.communicationChannel.length > 0 ? (
                                approval.communicationChannels.communicationChannel.map((channel, channelIndex) => (
                                    <li key={channelIndex}>{channel}</li>
                                ))
                            ) : (
                                <li>None</li>
                            )}
                        </ul>
                    </div>
                ))}

        </div>
    )
}