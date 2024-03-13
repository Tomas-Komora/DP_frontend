import { request, gql } from 'graphql-request'

export async function getServerSideProps() {
    const query = gql`
        {
            appSlotsQuery{
                appSlot{
                    productId
                    productName
                    type
                    allowedModification
                    assignedAppId
                    apps{
                        app{
                            productId
                            productName
                            category
                            status
                            allowedModification
                            iconURL
                            activeTo
                            description
                            instanceId
                            productGroup
                        }
                    }
                }
            },
            bonusSlots{
                productId
                productName
                type
                allowedModification
                category
                status
                iconURL
                description
                activeTo
                instanceId
            }
        }
    `

    const data = await request('http://localhost:3000/api/graphql', query)
    const { appSlotsQuery, bonusSlots } = data as any
    return {
        props: {
            appSlotsQuery,
            bonusSlots,
        },
    }

}
export default function Home({ appSlotsQuery, bonusSlots }) {
    const appSlots = appSlotsQuery[0].appSlot;
    return (
        <>
        <div className="py-5 grid grid-cols-2 sm:gap-4 sm:px-6">
            <div>
                <h1 className="text-lg font-semibold leading-7 text-gray-900">App Slots</h1>
                <ul className="mt-6 border-t border-gray-200 divide-y divide-gray-200">
                    {appSlots.map((appSlot) => (
                        <li key={appSlot.productId} className="py-4">
                            <div>
                                <h2 className="text-lg font-semibold">{appSlot.productName}</h2>
                                <p>Type: {appSlot.type}</p>
                                <p>Allowed Modification: {appSlot.allowedModification}</p>
                                <p>Assigned App ID: {appSlot.assignedAppId}</p>
                                <ul className="mt-2 border-t border-gray-200 divide-y divide-gray-200">
                                    {appSlot.apps.app.map((app) => (
                                        <li key={app.productId} className="py-2">
                                            <div>
                                                <h3 className="text-md font-semibold">{app.productName}</h3>
                                                <p>Category: {app.category}</p>
                                                <p>Status: {app.status}</p>
                                                <p>Allowed Modification: {app.allowedModification}</p>
                                                <p>Icon URL: {app.iconURL}</p>
                                                <p>Active To: {app.activeTo}</p>
                                                <p>Description: {app.description}</p>
                                                <p>Instance ID: {app.instanceId}</p>
                                                <p>Product Group: {app.productGroup}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h1 className="text-lg font-semibold leading-7 text-gray-900">Bonus Slots</h1>
                <ul className="mt-6 border-t border-gray-200 divide-y divide-gray-200">
                    {bonusSlots.map((bonusSlot) => (
                        <li key={bonusSlot.productId} className="py-4">
                            <div>
                                <h2 className="text-lg font-semibold">{bonusSlot.productName}</h2>
                                <p>Type: {bonusSlot.type}</p>
                                <p>Allowed Modification: {bonusSlot.allowedModification}</p>
                                <p>Category: {bonusSlot.category}</p>
                                <p>Status: {bonusSlot.status}</p>
                                <p>Icon URL: {bonusSlot.iconURL}</p>
                                <p>Description: {bonusSlot.description}</p>
                                <p>Active To: {bonusSlot.activeTo}</p>
                                <p>Instance ID: {bonusSlot.instanceId}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}