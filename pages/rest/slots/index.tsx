import axios from "axios";
import {z} from "zod";
import {ApprovalSchema} from "../../../schema/ApprovalsQuery";
import {ProductPromotionSchema} from "../../../schema/ProductPromotionsQuery";
import { SubscriberSchema} from "../../../schema/SubscriberQuery";
import {createKey} from "next/dist/shared/lib/router/router";

export const Schema = z.object({
    subscriberComplex: z.object({
        bonusSlots: z.object({
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
        }),
        appSlots: z.object({
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
    const appSlots = finalData.finalData.subscriberComplex.appSlots.appSlots
    const bonusSlots = finalData.finalData.subscriberComplex.bonusSlots.bonusSlots.bonusSlot
    return (
        <div>

        <div>
            <div>
                <h1>App Slots</h1>
                <ul>
                    {appSlots.map((appSlot) => (
                        <li key={appSlot.appSlot[0].productId}>
                            <h2>{appSlot.appSlot[0].productName}</h2>
                            <p>{appSlot.appSlot[0].type}</p>
                            <p>{appSlot.appSlot[0].allowedModification}</p>
                            <p>{appSlot.appSlot[0].assignedAppId}</p>
                            <ul>
                                {appSlot.appSlot[0].apps.app.map((app) => (
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
        </div>
    );
}