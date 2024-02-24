import axios from "axios";
import {z} from "zod";
import { useState, useEffect } from 'react';
import {servicesAndUsage, servicesAndUsageSchema} from "../../schema/ServicesAndUsageQuery";
import {ApprovalSchema, EntireApprovals} from "../../schema/ApprovalsQuery";
import {EntireAppSlots} from "../../schema/AppSlotsQuery";
import {ProductPromotionSchema, ProductPromotionsSchema} from "../../schema/ProductPromotionsQuery";
import {EntireResponseSchema} from "../../schema/BonusSlotsQuery";
import {ssoAccountSchema} from "../../schema/SsoAccountQuery";
import {EntireResponseSchemaSubscriber, SubscriberSchema} from "../../schema/SubscriberQuery";

const Schema = z.object({
    subscriberComplex: z.object({
        bonusSlots: EntireResponseSchema,
        approvalsSlots: z.array(ApprovalSchema),
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
        servicesAndUsage: servicesAndUsageSchema,
        ssoAccount:  z.object({
            otp: z.string().optional(),
            otpValidTo: z.string().optional(),
        }),
        subscriber: SubscriberSchema,
    })
});


export default function Home() {
    // const [data, setData] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await axios.get('http://localhost:8080/subComplex');
    //         const parsedResponse = Schema.parse(response.data);
    //         setData(parsedResponse);
    //     };
    //
    //     fetchData();
    // }, []);

    // if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h1>Rest Api</h1>
            {/* Render your data here */}
        </div>
    );
}