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
                                        {appSlot.appSlot[0].apps.app.map((app) => (
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
        </div>
    );
}