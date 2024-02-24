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
    )
}