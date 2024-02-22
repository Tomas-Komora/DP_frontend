import {extendType, objectType, queryType} from "nexus";
import axios from "axios";
import {array, z} from "zod";

export const bonusSlot = objectType({
    name: 'BonusSlot',
    definition(t) {
        t.string('productId');
        t.string('productName');
        t.string('type');
        t.string('allowedModification');
        t.string('category');
        t.string('status');
        t.string('iconURL');
        t.string('description');
        t.string('activeTo');
        t.int('instanceId');
    }
})

const EntireResponseSchema = z.object({
    bonusSlots: z.object({
        bonusSlot: z.array(z.object({
            productId: z.string(),
            productName: z.string(),
            type: z.string(),
            allowedModification: z.string().nullable(), // Since allowedModification can be null
            category: z.string(),
            status: z.string(),
            iconURL: z.string(),
            description: z.string(),
            activeTo: z.string(),
            instanceId: z.number(), // Assuming instanceId is a number based on the given example
        })),
    }),
});

export const BonusSlotsQuery = extendType({
    type: 'Query',
    definition(t) {
        t.list.field('bonusSlots', {
            type: 'BonusSlot',
            resolve: async () => {
                try {
                    const response = await axios.get('http://localhost:8080/bonusSlots');
                    const parsedResponse = EntireResponseSchema.parse(response.data);
                    //console.log(JSON.stringify(parsedResponse));
                    return parsedResponse.bonusSlots.bonusSlot;
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        console.error("Failed to parse bonus slots data:", error.errors);
                    } else {
                        console.error("An error occurred while fetching bonus slots:", error);
                    }
                    return [];
                }
            },
        });
    },
});
